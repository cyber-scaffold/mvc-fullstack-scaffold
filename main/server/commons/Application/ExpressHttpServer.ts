import http from "http";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { injectable, inject } from "inversify";
import { compileConfiguration, getRuntimeConfiguration } from "@/library";

import type { Express } from "express";

import { IOCContainer } from "@/main/server/commons/Application/IOCContainer";
import { RegistryRouter } from "@/main/server/commons/Application/RegistryRouter";
import { ApplicationConfigManager } from "@/main/server/commons/Application/ApplicationConfigManager";

import { requestMiddleware } from "@/main/server/interceptors/requestMiddleware";
import { logger } from "@/main/server/utils/logger";

@injectable()
export class ExpressHttpServer {

  private serverInstance: http.Server;

  private expressInstance: Express = express();

  constructor(
    @inject(ApplicationConfigManager) private readonly $ApplicationConfigManager: ApplicationConfigManager,
    @inject(RegistryRouter) private readonly $RegistryRouter: RegistryRouter,
  ) { }

  /** 在服务启动前需要执行的操作 **/
  public async beforeBootstrap() {
    await this.$ApplicationConfigManager.initialize();
    /** 在运行时的时候需要基于当前的filename来确定项目的根目录 **/
    const { projectDirectoryPath, assetsDirectoryName } = this.$ApplicationConfigManager.getRuntimeConfig();
    await compileConfiguration({ projectDirectoryPath, assetsDirectoryName });
  };

  /** 服务启动时执行的代码 **/
  public async bootstrap() {
    const { hydrationResourceDirectoryPath } = await getRuntimeConfiguration();
    const { staticResourceDirectory } = this.$ApplicationConfigManager.getRuntimeConfig();
    /** 注册中间件 **/
    this.expressInstance.use(cookieParser());
    this.expressInstance.use(bodyParser.json());
    this.expressInstance.use(bodyParser.urlencoded({ extended: true }));
    /** 注册请求级容器中间件 **/
    this.expressInstance.use(requestMiddleware);
    /** 注册控制器 **/
    await this.$RegistryRouter.execute(this.expressInstance);
    /** 提供开发框架静态资源比如swagger文档 **/
    this.expressInstance.use(express.static(staticResourceDirectory, {
      // maxAge: env === "development" ? -1 : (100 * 24 * 60 * 60)
    }));
    /** 提供注水javascript和静态资源的路由 */
    this.expressInstance.use("/hydration/", express.static(hydrationResourceDirectoryPath, {
      // maxAge: env === "development" ? -1 : (100 * 24 * 60 * 60)
    }));
    /** 启动服务器监听端口 **/
    const { server } = this.$ApplicationConfigManager.getRuntimeConfig();
    this.serverInstance = this.expressInstance.listen(server.port, async () => {
      try {
        logger.info("Address %s", this.serverInstance.address());
      } catch (error) {
        logger.error(error);
        process.exit(0);
      };
    });
  };

};

/** 注册应用的启动类 **/
IOCContainer.bind(ExpressHttpServer).toSelf().inSingletonScope();