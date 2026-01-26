import { injectable, inject } from "inversify";
import { createConnection, Connection } from "mongoose";

import { ApplicationConfigManager } from "@/main/server/commons/Application/ApplicationConfigManager";
import { IOCContainer } from "@/main/server/commons/Application/IOCContainer";

import { logger } from "@/main/server/utils/logger";

@injectable()
export class MongooseConnectManager {

  private connection: Connection;

  constructor(
    @inject(ApplicationConfigManager) private readonly $ApplicationConfigManager: ApplicationConfigManager
  ) { };

  public async initialize() {
    try {
      const { mongodb } = this.$ApplicationConfigManager.getRuntimeConfig();
      const { host, port, username, password, database } = mongodb;
      const connectionURL = `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=admin`;
      const connection = await createConnection(connectionURL);
      this.connection = connection;
      logger.info("Mongoose 连接成功!!!");
    } catch (error) {
      logger.error("Mongoose 连接失败!!! %s", error);
    };
  };

  /** 销毁连接,用于单元测试 **/
  public async destroy() {
    await this.connection.destroy();
    logger.info("Mongoose 连接已销毁!!!");
  };

  public async getDatabaseWithName(databaseName) {
    // return this.connection;
    const database = await this.connection.useDb(databaseName);
    return database;
  };

};

IOCContainer.bind(MongooseConnectManager).toSelf().inSingletonScope();