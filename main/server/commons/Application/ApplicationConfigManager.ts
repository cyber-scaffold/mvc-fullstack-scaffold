import path from "path";
import { injectable } from "inversify";

import { IOCContainer } from "@/main/server/cores/IOCContainer";


@injectable()
export class ApplicationConfigManager {

  private server = {
    port: 8190
  };

  private redis = {
    port: 6379,
    host: "0.0.0.0",
  };

  private mysql = {
    port: 3306,
    host: "0.0.0.0",
    username: "root",
    password: "gaea0571",
    database: "gmecamp_config"
  };

  private mongodb = {
    host: "0.0.0.0",
    port: 27017,
    username: "root",
    password: "gaea0571",
    database: "test_data"
  };

  private rabbitmq = {
    host: "0.0.0.0",
    port: 5672,
    username: "root",
    password: "gaea0571"
  };

  /**
   * 用于确定其余资源
   * 项目根目录的绝对路径
   * **/
  private projectDirectoryPath = path.resolve(__dirname, "../../../../");

  /**
   * 编译后的资产对应的目录名
   * **/
  private assetsDirectoryName = "dist";

  /**
   * 编译资产对应的资源路径
   * **/
  private assetsDirectoryPath = path.resolve(this.projectDirectoryPath, this.assetsDirectoryName);

  /**
   * 公共资源所在的目录比如要向前端浏览器提供的dll动态链接库文件
   * 框架层的基准目录是根据 项目根目录的绝对路径 计算得到的
   * **/
  private publicResourceDirectory = path.resolve(this.assetsDirectoryPath, "public");

  /**
   * 用于启动静态资源服务器
   * 框架层的基准目录是根据 项目根目录的绝对路径 计算得到的
   * **/
  private staticResourceDirectory = path.resolve(this.assetsDirectoryPath, "statics");

  /**
   * Swagger静态资源所在的目录
   * **/
  private swaggerResourceDirectory = path.resolve(this.assetsDirectoryPath, "swagger");

  /** 初始化并加载配置到运行时 **/
  public async initialize() {

  };

  /** 获取最终组合之后的运行时配置 **/
  public getRuntimeConfig() {
    return {
      server: this.server,
      redis: this.redis,
      mysql: this.mysql,
      mongodb: this.mongodb,
      rabbitmq: this.rabbitmq,
      assetsDirectoryName: this.assetsDirectoryName,
      projectDirectoryPath: this.projectDirectoryPath,
      staticResourceDirectory: this.staticResourceDirectory,
      swaggerResourceDirectory: this.swaggerResourceDirectory,
      publicResourceDirectory: this.publicResourceDirectory,
    };
  };

};

IOCContainer.bind(ApplicationConfigManager).toSelf().inSingletonScope();