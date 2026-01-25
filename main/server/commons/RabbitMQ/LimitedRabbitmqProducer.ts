import amqp, { Connection } from "amqplib";
import { injectable, inject } from "inversify";

import { ApplicationConfigManager } from "@/main/server/commons/Application/ApplicationConfigManager";
import { IOCContainer } from "@/main/server/commons/Application/IOCContainer";
import { logger } from "@/main/server/utils/logger";

export interface IPublishOption {
  exchangeName: string;
  routerName: string;
  queueName: string;
};

/** Rabbitmq生产者的抽象基础类 **/
@injectable()
export class LimitedRabbitmqProducer {

  public channel: any;

  private Exchange_TTL: string;

  private Queue_TTL: string;

  private RoutingKey_TTL: string;

  private Exchange_DLX: string;

  private Queue_DLX: string;

  private RoutingKey_DLX: string;

  /** 创建Rabbitmq之后的连接 **/
  private connection: Connection;

  constructor(
    @inject(ApplicationConfigManager) private readonly $ApplicationConfigManager: ApplicationConfigManager
  ) { };

  /** 消息队列初始化 **/
  public async initialize(options: IPublishOption) {
    try {
      const { exchangeName, routerName, queueName } = options;
      this.Exchange_TTL = `${exchangeName}_TTL`;
      this.Queue_TTL = `${queueName}_TTL`;
      this.RoutingKey_TTL = `${routerName}_TTL`;
      this.Exchange_DLX = `${exchangeName}_DLX`;
      this.Queue_DLX = `${queueName}_DLX`;
      this.RoutingKey_DLX = `${routerName}_DLX`;
      const { rabbitmq } = this.$ApplicationConfigManager.getRuntimeConfig();
      const rabbitConfig = {
        hostname: rabbitmq.host,
        port: rabbitmq.port,
        username: rabbitmq.username,
        password: rabbitmq.password
      };
      this.connection = await amqp.connect({
        protocol: "amqp",
        ...rabbitConfig
      });
      logger.info("RabbitMQ-生产者-连接成功!");
      /** 处理断线重连 **/
      this.connection.on("close", (error) => {
        logger.error("RabbitMQ连接已关闭,2s后准备重新连接 %s", error);
        return setTimeout(this.initialize, 2000);
      });
    } catch (error) {
      logger.error("RabbitMQ连接初始化发生错误,2s后准备重新连接 %s", error);
      return setTimeout(this.initialize, 2000);
    };
  };

  /** 销毁连接,用于单元测试 **/
  public async destroy() {
    await this.connection.close();
    logger.warn("RabbitMQ 已断开连接!!!");
  };

  /** 创建一个并行队列 **/
  public async createQueueWithExchange() {
    this.channel = await this.connection.createChannel();
    await this.channel.assertExchange(this.Exchange_DLX, "direct", { durable: true, autoDelete: true });
    await this.channel.assertQueue(this.Queue_DLX, {
      durable: true,
      exclusive: false,
    });
    await this.channel.bindQueue(this.Queue_DLX, this.Exchange_DLX, this.RoutingKey_DLX);
    //创建消息队列
    await this.channel.assertExchange(this.Exchange_TTL, "direct", { durable: true, autoDelete: true, });
    await this.channel.assertQueue(this.Queue_TTL, {
      durable: true,
      deadLetterExchange: this.Exchange_DLX,
      deadLetterRoutingKey: this.RoutingKey_DLX
    });
    await this.channel.bindQueue(this.Queue_TTL, this.Exchange_TTL, this.RoutingKey_TTL);
    return true;
  };

  /** 创建一个并行队列 **/
  public async publishWithExchange(message: any) {
    await this.channel.publish(this.Exchange_TTL, this.RoutingKey_TTL, Buffer.from(message), {
      deliveryMode: 2,
      persistent: true,
    });
    return true;
  };

};

IOCContainer.bind(LimitedRabbitmqProducer).toSelf().inSingletonScope();

