import http from "http";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/sources/applications/IOCContainer";
import { MainfastDetail } from "@/sources/applications/MainfastDetail";
import { ApplicationConfigManager } from "@/sources/configs/ApplicationConfigManager";
import { requestMiddleware } from "@/sources/interceptors/requestMiddleware";
import { router as IndexPageController } from "@/sources/controllers/IndexPageController";
import { router as DetailPageController } from "@/sources/controllers/DetailPageController";

@injectable()
export class ExpressHttpServer {

  private app = express();

  private server: http.Server;

  constructor(
    @inject(ApplicationConfigManager) private readonly $ApplicationConfigManager: ApplicationConfigManager,
    @inject(MainfastDetail) private readonly $MainfastDetail: MainfastDetail
  ) { }

  /** 初始化MongoDB **/
  private async bootstrapMySQL() {

  };

  /** 初始化Redis **/
  private async bootstrapRedis() {

  };

  /** 初始化MongoDB **/
  private async bootstrapMongoDB() {

  };

  /** 初始化RabbitMQ **/
  private async bootstrapRabbitMQ() {

  };

  public async bootstrap() {
    await this.$ApplicationConfigManager.initialize();
    /** 注册中间件 **/
    this.app.use(cookieParser());
    this.app.use(bodyParser.json());
    /** 注册请求级容器中间件 **/
    this.app.use(requestMiddleware);
    /** 注册控制器 **/
    this.app.use(IndexPageController);
    this.app.use(DetailPageController);
    /** 静态资源 **/
    this.app.use(express.static(this.$MainfastDetail.projectDirectory));
    /** 启动服务器监听端口 **/
    const { server } = this.$ApplicationConfigManager.getRuntimeConfig();
    this.server = this.app.listen(server.port, async () => {
      try {
        await this.bootstrapMySQL();
        await this.bootstrapMongoDB();
        await this.bootstrapRedis();
        await this.bootstrapRabbitMQ();
        console.log("address", this.server.address());
      } catch (error) {
        console.log(error);
        process.exit(0);
      };
    });
  };

};

/** 注册应用的启动类 **/
IOCContainer.bind(ExpressHttpServer).toSelf().inSingletonScope();