import { injectable, inject } from "inversify";
import { IOCContainer } from "@/main/server/cores/IOCContainer";

import { DataSourceManager } from "@/main/server/commons/Componnets/MySQL/DataSourceManager";
import { QueryBuilderManager } from "@/main/server/commons/Componnets/MySQL/QueryBuilderManager";
import { MySQLConnectManager } from "@/main/server/commons/Componnets/MySQL/MySQLConnectManager";
import { RedisConnectManager } from "@/main/server/commons/Componnets/Redis/RedisConnectManager";
import { MongooseConnectManager } from "@/main/server/commons/Componnets/MongoDB/MongooseConnectManager";
import { LimitedRabbitmqProducer } from "@/main/server/commons/Componnets/RabbitMQ/LimitedRabbitmqProducer";
import { LimitedRabbitmqConsumer } from "@/main/server/commons/Componnets/RabbitMQ/LimitedRabbitmqConsumer";

@injectable()
export class InitialComponent {

  constructor (
    @inject(LimitedRabbitmqProducer) private readonly $LimitedRabbitmqProducer: LimitedRabbitmqProducer,
    @inject(LimitedRabbitmqConsumer) private readonly $LimitedRabbitmqConsumer: LimitedRabbitmqConsumer,
    @inject(MongooseConnectManager) private readonly $MongooseConnectManager: MongooseConnectManager,
    @inject(MySQLConnectManager) private readonly $MySQLConnectManager: MySQLConnectManager,
    @inject(RedisConnectManager) private readonly $RedisConnectManager: RedisConnectManager,
    @inject(QueryBuilderManager) private readonly $QueryBuilderManager: QueryBuilderManager,
    @inject(DataSourceManager) private readonly $DataSourceManager: DataSourceManager,
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

  public async execute() {
    await this.bootstrapMySQL();
    await this.bootstrapMongoDB();
    await this.bootstrapRedis();
    await this.bootstrapRabbitMQ();
  };

};

IOCContainer.bind(InitialComponent).toSelf().inRequestScope();