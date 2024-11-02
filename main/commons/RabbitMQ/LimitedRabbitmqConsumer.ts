import { red, green } from "colors";
import amqp, { Connection } from "amqplib";
import { injectable, inject } from "inversify";

import { ApplicationConfigManager } from "@/main/configs/ApplicationConfigManager";
import { IOCContainer } from "@/main/commons/Application/IOCContainer";
import { logger } from "@/main/utils/logger";

export interface IListenerOption {
  exchangeName: string;
  routerName: string;
  queueName: string;
};

/** Rabbitmq消费者者的抽象基础类 **/
@injectable()
export class LimitedRabbitmqConsumer {

  public channel: any;

  private Exchange_TTL: string;

  private Queue_TTL: string;

  private RoutingKey_TTL: string;

  private Exchange_DLX: string;

  private RoutingKey_DLX: string;

  /** 创建Rabbitmq之后的连接 **/
  private connection: Connection;

  constructor(
    @inject(ApplicationConfigManager) private readonly $ApplicationConfigManager: ApplicationConfigManager
  ) { };

  /** 消息队列初始化 **/
  public async initialize(options: IListenerOption) {
    try {
      const { exchangeName, routerName, queueName } = options;
      this.Exchange_TTL = `${exchangeName}_TTL`;
      this.Queue_TTL = `${queueName}_TTL`;
      this.RoutingKey_TTL = `${routerName}_TTL`;
      this.Exchange_DLX = `${exchangeName}_DLX`;
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
      logger.info(green("RabbitMQ-消费者-连接成功!"));
      /** 处理断线重连 **/
      this.connection.on("close", (error) => {
        logger.error(red(`RabbitMQ连接已关闭,2s后准备重新连接 ${error}`));
        return setTimeout(this.initialize, 2000);
      });
    } catch (error) {
      logger.error(red(`RabbitMQ连接初始化发生错误,2s后准备重新连接 ${error}`));
      return setTimeout(this.initialize, 2000);
    };
  };

  /** 销毁连接,用于单元测试 **/
  public async destroy() {
    await this.connection.close();
    console.log("RabbitMQ 已断开连接!!!");
  };

  /** 创建或加入一个频道 **/
  public async createChannelWithExchange() {

    this.channel = await this.connection.createChannel();
    /** 生成频道的时候是使用交换机模式 **/
    await this.channel.assertExchange(this.Exchange_TTL, "direct", { durable: true, autoDelete: true });
    await this.channel.assertQueue(this.Queue_TTL, {
      durable: true,
      deadLetterExchange: this.Exchange_DLX,
      deadLetterRoutingKey: this.RoutingKey_DLX
    });
    /** 消费端限流,每次取有限个进行消费 **/
    await this.channel.prefetch(20);
    await this.channel.qos(20);
    await this.channel.bindQueue(this.Queue_TTL, this.Exchange_TTL, this.RoutingKey_TTL);
    return true;
  };

  /** 增加一个监听器 **/
  public async addListener(callback) {
    this.channel.consume(this.Queue_TTL, (message: any) => callback(message, this.channel), { noAck: false });
    return true;
  };

};


IOCContainer.bind(LimitedRabbitmqConsumer).toSelf().inSingletonScope();
