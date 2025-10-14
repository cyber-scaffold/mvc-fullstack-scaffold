import http from "http";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/main/commons/Application/IOCContainer";
import { FrameworkDetail } from "@/main/commons/Application/FrameworkDetail";
import { ViewsMainfastDetail } from "@/main/commons/Application/ViewsMainfastDetail";

import { RedisConnectManager } from "@/main/commons/Redis/RedisConnectManager";

import { DataSourceManager } from "@/main/commons/MySQL/DataSourceManager";
import { QueryBuilderManager } from "@/main/commons/MySQL/QueryBuilderManager";
import { MySQLConnectManager } from "@/main/commons/MySQL/MySQLConnectManager";

import { MongooseConnectManager } from "@/main/commons/MongoDB/MongooseConnectManager";

import { LimitedRabbitmqProducer } from "@/main/commons/RabbitMQ/LimitedRabbitmqProducer";
import { LimitedRabbitmqConsumer } from "@/main/commons/RabbitMQ/LimitedRabbitmqConsumer";

import { ApplicationConfigManager } from "@/main/configs/ApplicationConfigManager";
import { requestMiddleware } from "@/main/interceptors/requestMiddleware";

import { DetailPageController } from "@/main/controllers/DetailPageController";
import { IndexPageController } from "@/main/controllers/IndexPageController";
import { SearchController } from "@/main/controllers/SearchController";

import { logger } from "@/main/utils/logger";

@injectable()
export class ExpressHttpServer {

  private app = express();

  private server: http.Server;

  constructor(
    @inject(ApplicationConfigManager) private readonly $ApplicationConfigManager: ApplicationConfigManager,
    @inject(LimitedRabbitmqProducer) private readonly $LimitedRabbitmqProducer: LimitedRabbitmqProducer,
    @inject(LimitedRabbitmqConsumer) private readonly $LimitedRabbitmqConsumer: LimitedRabbitmqConsumer,
    @inject(MongooseConnectManager) private readonly $MongooseConnectManager: MongooseConnectManager,
    @inject(MySQLConnectManager) private readonly $MySQLConnectManager: MySQLConnectManager,
    @inject(RedisConnectManager) private readonly $RedisConnectManager: RedisConnectManager,
    @inject(QueryBuilderManager) private readonly $QueryBuilderManager: QueryBuilderManager,
    @inject(DataSourceManager) private readonly $DataSourceManager: DataSourceManager,
    @inject(DetailPageController) private readonly $DetailPageController: DetailPageController,
    @inject(IndexPageController) private readonly $IndexPageController: IndexPageController,
    @inject(SearchController) private readonly $SearchController: SearchController,
    @inject(FrameworkDetail) private readonly $FrameworkDetail: FrameworkDetail,
    @inject(ViewsMainfastDetail) private readonly $ViewsMainfastDetail: ViewsMainfastDetail
  ) { }

  /** 初始化MongoDB **/
  private async bootstrapMySQL() {
    await this.$DataSourceManager.initialize();
    await this.$MySQLConnectManager.initialize();
    await this.$QueryBuilderManager.initialize();
  };

  /** 初始化Redis **/
  private async bootstrapRedis() {
    await this.$RedisConnectManager.initialize();
  };

  /** 初始化MongoDB **/
  private async bootstrapMongoDB() {
    await this.$MongooseConnectManager.initialize();
  };

  /** 初始化RabbitMQ **/
  private async bootstrapRabbitMQ() {
    /** 初始化生产者 **/
    await this.$LimitedRabbitmqProducer.initialize({
      exchangeName: "testExchange",
      routerName: "testRouter",
      queueName: "testQueue"
    });
    await this.$LimitedRabbitmqProducer.createQueueWithExchange();

    /** 初始化消费者 **/
    await this.$LimitedRabbitmqConsumer.initialize({
      exchangeName: "testExchange",
      routerName: "testRouter",
      queueName: "testQueue"
    });
    await this.$LimitedRabbitmqConsumer.createChannelWithExchange();
  };

  public async bootstrap() {
    await this.$ApplicationConfigManager.initialize();
    await this.$ViewsMainfastDetail.initialize();
    const { env } = await this.$ViewsMainfastDetail.getMainfastFileContent();
    /** 注册中间件 **/
    this.app.use(cookieParser());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    /** 注册请求级容器中间件 **/
    this.app.use(requestMiddleware);
    /** 注册控制器 **/
    this.app.use(this.$DetailPageController.getRouter());
    this.app.use(this.$IndexPageController.getRouter());
    this.app.use(this.$SearchController.getRouter());
    /** 提供开发框架静态资源比如swagger文档 **/
    this.app.use(express.static(this.$FrameworkDetail.frameworkDirectory, {
      maxAge: env === "development" ? -1 : (100 * 24 * 60 * 60)
    }));
    /** 提供视图层静态资源 **/
    this.app.use(express.static(this.$ViewsMainfastDetail.projectDirectory, {
      maxAge: env === "development" ? -1 : (100 * 24 * 60 * 60)
    }));
    /** 启动服务器监听端口 **/
    const { server } = this.$ApplicationConfigManager.getRuntimeConfig();
    this.server = this.app.listen(server.port, async () => {
      try {
        // await this.bootstrapMySQL();
        // await this.bootstrapMongoDB();
        // await this.bootstrapRedis();
        // await this.bootstrapRabbitMQ();
        logger.info("Address %s", this.server.address());
      } catch (error) {
        logger.error(error);
        process.exit(0);
      };
    });
  };

};

/** 注册应用的启动类 **/
IOCContainer.bind(ExpressHttpServer).toSelf().inSingletonScope();