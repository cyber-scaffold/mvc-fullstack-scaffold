import path from "path";
import { injectable } from "inversify";


import { IOCContainer } from "@/main/server/commons/Application/IOCContainer";

// type CustmerConfigParamType = {
//   server?: any
//   redis?: any
//   mysql?: any
//   mongodb?: any
//   rabbitmq?: any
// };

@injectable()
export class ApplicationConfigManager {

  private assetsDirectoryName = "dist";

  /**
   * 用于确定其余资源
   * 项目根目录的绝对路径
   * **/
  get projectDirectoryPath() {
    return path.dirname(__filename).replace(/(dist)$/ig, "");
  };

  /**
   * 用于启动静态资源服务器
   * 框架层的基准目录是根据 项目根目录的绝对路径 计算得到的
   * **/
  get staticResourceDirectory() {
    return path.join(this.projectDirectoryPath, this.assetsDirectoryName, "resources");
  };

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

  /** 初始化并加载配置到运行时 **/
  public async initialize() {

  };

  /** 获取最终组合之后的运行时配置 **/
  public getRuntimeConfig() {
    return {
      assetsDirectoryName: this.assetsDirectoryName,
      projectDirectoryPath: this.projectDirectoryPath,
      staticResourceDirectory: this.staticResourceDirectory,
      server: this.server,
      redis: this.redis,
      mysql: this.mysql,
      mongodb: this.mongodb,
      rabbitmq: this.rabbitmq
    };
  };

};

IOCContainer.bind(ApplicationConfigManager).toSelf().inSingletonScope();