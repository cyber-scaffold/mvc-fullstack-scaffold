import knex, { Knex } from "knex";
import { injectable, inject } from "inversify";

import { ApplicationConfigManager } from "@/main/configs/ApplicationConfigManager";
import { IOCContainer } from "@/main/commons/Application/IOCContainer";

import { logger } from "@/main/utils/logger";

@injectable()
export class QueryBuilderManager {

  private knexQueryBuilder: Knex;

  constructor(
    @inject(ApplicationConfigManager) private readonly $ApplicationConfigManager: ApplicationConfigManager
  ) { };

  /** 初始化knex**/
  public async initialize() {
    const { mysql } = this.$ApplicationConfigManager.getRuntimeConfig();
    this.knexQueryBuilder = knex({
      client: "mysql2",
      connection: {
        host: mysql.host,
        port: mysql.port,
        user: mysql.username,
        password: mysql.password,
        database: mysql.database
      }
    });
    logger.info("Knex 查询构建器!");
  };

  /** 根据数据库名称获取knex的QueryBuilder **/
  public async getQueryBuilder(): Promise<Knex> {
    return this.knexQueryBuilder;
  };

};

IOCContainer.bind(QueryBuilderManager).toSelf().inSingletonScope();