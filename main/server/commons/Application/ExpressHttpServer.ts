import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { Express } from "express";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/main/server/commons/Application/IOCContainer";
import { FrameworkDetail } from "@/main/server/commons/Application/FrameworkDetail";
import { InitialComponent } from "@/main/server/commons/Application/InitialComponent";
import { RegistryRouter } from "@/main/server/commons/Application/RegistryRouter";
import { ApplicationConfigManager } from "@/main/server/commons/Application/ApplicationConfigManager";

import { requestMiddleware } from "@/main/server/interceptors/requestMiddleware";

import { logger } from "@/main/server/utils/logger";

import { compileConfiguration } from "@/library";

import type { IFrameworkConfig } from "@/library";

@injectable()
export class ExpressHttpServer {

  private serverInstance: http.Server;

  private expressInstance: Express = express();

  private compileConfigurationInfo: IFrameworkConfig;

  constructor(
    @inject(ApplicationConfigManager) private readonly $ApplicationConfigManager: ApplicationConfigManager,
    @inject(InitialComponent) private readonly $InitialComponent: InitialComponent,
    @inject(FrameworkDetail) private readonly $FrameworkDetail: FrameworkDetail,
    @inject(RegistryRouter) private readonly $RegistryRouter: RegistryRouter,
  ) { }

  /** 在服务启动前需要执行的操作 **/
  public async beforeBootstrap() {
    await this.$ApplicationConfigManager.initialize();
    this.compileConfigurationInfo = await compileConfiguration();
  };

  /** 服务启动时执行的代码 **/
  public async bootstrap() {
    /** 注册中间件 **/
    this.expressInstance.use(cookieParser());
    this.expressInstance.use(bodyParser.json());
    this.expressInstance.use(bodyParser.urlencoded({ extended: true }));
    /** 注册请求级容器中间件 **/
    this.expressInstance.use(requestMiddleware);
    /** 注册控制器 **/
    await this.$RegistryRouter.execute(this.expressInstance);
    /** 提供开发框架静态资源比如swagger文档 **/
    this.expressInstance.use(express.static(this.$FrameworkDetail.frameworkDirectory, {
      // maxAge: env === "development" ? -1 : (100 * 24 * 60 * 60)
    }));
    /** 提供注水javascript和静态资源的路由 */
    this.expressInstance.use("/hydration/", express.static(this.compileConfigurationInfo.hydrationResourceDirectoryPath, {
      // maxAge: env === "development" ? -1 : (100 * 24 * 60 * 60)
    }));
    /** 启动服务器监听端口 **/
    const { server } = this.$ApplicationConfigManager.getRuntimeConfig();
    this.serverInstance = this.expressInstance.listen(server.port, async () => {
      try {
        // await this.$InitialComponent.execute();
        await this.$RegistryRouter.processSSRResource();
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