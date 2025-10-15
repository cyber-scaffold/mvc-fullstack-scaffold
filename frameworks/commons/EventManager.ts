import { EventEmitter } from "events";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/commons/IOCContainer";

export type AssetsStatusDetailType = {
  client: boolean,
  server: boolean
};

@injectable()
export class EventManager {

  /**
   * 用于内部通信的事件总线
   * **/
  private event: EventEmitter = new EventEmitter();

  /**
   * 编译资产的编译状态详情
   * **/
  private assetsStatusDetailType: AssetsStatusDetailType = {
    client: false,
    server: false
  };

  /**
   * 初始化句柄,在这里启动监听,监听编译过程中资产的情况
   * **/
  public initialize() {
    this.event.on("CLIENT_MAKE_START_EVENT", () => {
      this.assetsStatusDetailType.client = false;
    });
    this.event.on("SERVER_MAKE_START_EVENT", () => {
      this.assetsStatusDetailType.server = false;
    });
  };

  /**
   * 注册各个端编译完成后的处理函数
   * **/
  public registryMakeComplateCallback(callback) {
    this.event.on("CLIENT_MAKE_COMPLATE_EVENT", async () => {
      this.assetsStatusDetailType.client = true;
      await callback(this.assetsStatusDetailType);
    });
    this.event.on("SERVER_MAKE_COMPLATE_EVENT", async () => {
      this.assetsStatusDetailType.server = true;
      await callback(this.assetsStatusDetailType);
    });
  };

  /**
   * 注册收到客户端资源清单事件后的处理函数
   * **/
  public registryReceiveRequirementClientModuleListCallback(callback) {
    this.event.on("RECEIVE_REQUIREMENT_CLIENT_MODULE_LIST_EVENT", async (sourceCodeRelativePathList) => {
      await callback(sourceCodeRelativePathList);
    });
  };

  /**
   * 收到客户端资源清单的事件
   * **/
  public emitReceiveRequirementClientModuleListEvent(sourceCodeRelativePathList) {
    this.event.emit("RECEIVE_REQUIREMENT_CLIENT_MODULE_LIST_EVENT", sourceCodeRelativePathList);
  };

  /**
   * 客户端开始编译的事件
   * **/
  public emitClientMakeStartEvent() {
    this.event.emit("CLIENT_MAKE_START_EVENT");
  };

  /**
   * 客户端完成编译的事件
   * **/
  public emitClientMakeComplateEvent() {
    this.event.emit("CLIENT_MAKE_COMPLATE_EVENT");
  };

  /**
   * 服务端开始编译的事件
   * **/
  public emitServerMakeStartEvent() {
    this.event.emit("SERVER_MAKE_START_EVENT");
  };

  /**
   * 服务端完成编译的事件
   * **/
  public emitServerMakeComplateEvent() {
    this.event.emit("SERVER_MAKE_COMPLATE_EVENT");
  };

};

IOCContainer.bind(EventManager).toSelf().inSingletonScope();