import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { injectable, inject } from "inversify";
import { getRuntimeConfiguration } from "@/library/runtime";

import { IOCContainer } from "@/main/server/cores/IOCContainer";
import { ApplicationConfigManager } from "@/main/server/commons/Application/ApplicationConfigManager";

import { requestMiddleware } from "@/main/server/interceptors/requestMiddleware";

import { DetailPageController } from "@/main/server/controllers/DetailPageController";
import { IndexPageController } from "@/main/server/controllers/IndexPageController";
import { UserPageController } from "@/main/server/controllers/UserPageController";
import { SearchController } from "@/main/server/controllers/SearchController";

import { logger } from "@/main/server/utils/logger";

import type { Server } from "http";
import type { Express } from "express";

@injectable()
export class ExpressHttpServer {

  private serverInstance: Server;

  private expressInstance: Express = express();

  constructor (
    @inject(ApplicationConfigManager) private readonly $ApplicationConfigManager: ApplicationConfigManager,
    @inject(DetailPageController) private readonly $DetailPageController: DetailPageController,
    @inject(IndexPageController) private readonly $IndexPageController: IndexPageController,
    @inject(UserPageController) private readonly $UserPageController: UserPageController,
    @inject(SearchController) private readonly $SearchController: SearchController,
  ) { }

  /** 服务启动时执行的代码 **/
  public async bootstrap() {
    const { server } = await this.$ApplicationConfigManager.getRuntimeConfig();
    const { hydrationResourceDirectoryPath } = await getRuntimeConfiguration();
    const { fileResourceDirectory, staticResourceDirectory, swaggerResourceDirectory, publicResourceDirectory } = await this.$ApplicationConfigManager.getRuntimeConfig();
    /** 注册中间件 **/
    this.expressInstance.use(cookieParser());
    this.expressInstance.use(bodyParser.json());
    this.expressInstance.use(bodyParser.urlencoded({ extended: true }));
    /** 注册项目中的自定义中间件 **/
    this.expressInstance.use(requestMiddleware);
    /** 注册项目中的控制器 **/
    this.expressInstance.use(this.$DetailPageController.getRouter());
    this.expressInstance.use(this.$IndexPageController.getRouter());
    this.expressInstance.use(this.$UserPageController.getRouter());
    this.expressInstance.use(this.$SearchController.getRouter());
    /** 组件中的静态文件 **/
    this.expressInstance.use("/resource/", express.static(fileResourceDirectory, {
      // maxAge: env === "development" ? -1 : (100 * 24 * 60 * 60)
    }));
    /** 公共文件的资源目录 比如dll动态链接库 **/
    this.expressInstance.use("/public/", express.static(publicResourceDirectory, {
      // maxAge: env === "development" ? -1 : (100 * 24 * 60 * 60)
    }));
    /** 其余静态文件的资源目录,比如网站的icon文件等 **/
    this.expressInstance.use("/statics/", express.static(staticResourceDirectory, {
      // maxAge: env === "development" ? -1 : (100 * 24 * 60 * 60)
    }));
    /** Swagger文档的资源目录 **/
    this.expressInstance.use("/swagger/", express.static(swaggerResourceDirectory, {
      // maxAge: env === "development" ? -1 : (100 * 24 * 60 * 60)
    }));
    /** 前端渲染需要的注水资源的资源目录 */
    this.expressInstance.use("/hydration/", express.static(hydrationResourceDirectoryPath, {
      // maxAge: env === "development" ? -1 : (100 * 24 * 60 * 60)
    }));
    /** 启动服务器监听端口 **/
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