import { injectable, inject } from "inversify";
import { createClient, RedisClientType } from "redis";

import { ApplicationConfigManager } from "@/main/server/commons/Application/ApplicationConfigManager";
import { IOCContainer } from "@/main/server/commons/Application/IOCContainer";

import { logger } from "@/main/server/utils/logger";

@injectable()
export class RedisConnectManager {

  private connection: RedisClientType;

  constructor(
    @inject(ApplicationConfigManager) private readonly $ApplicationConfigManager: ApplicationConfigManager
  ) { };

  /** 初始化Redis连接 **/
  public async initialize(): Promise<void> {
    const { redis } = this.$ApplicationConfigManager.getRuntimeConfig();
    try {
      this.connection = createClient({
        url: `redis://${redis.host}:${redis.port}`,
        socket: { reconnectStrategy: false }
      });

      this.connection.on("error", async (error) => {
        logger.error("Redis 出现错误,2s后重新连接... ...", error);
        return setTimeout(this.initialize, 2000);
      });

      await this.connection.connect();

      logger.info("Redis 连接成功!");
    } catch (error: any) {
      this.connection.removeAllListeners("error");
      throw error;
    };
  };

  /** 从连接池中获取一个连接 **/
  public async getConnection(): Promise<RedisClientType> {
    try {
      return this.connection;
    } catch (error) {
      throw error;
    };
  };

};

IOCContainer.bind(RedisConnectManager).toSelf().inSingletonScope();