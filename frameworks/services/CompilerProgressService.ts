import { EventEmitter } from "events";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/commons/IOCContainer";

export type AssetsStatusDetailType = {
  client: boolean,
  server: boolean
};

@injectable()
export class CompilerProgressService {

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
    this.event.on("StartMakeClient", () => {
      this.assetsStatusDetailType.client = false;
    });
    this.event.on("StartMakeServer", () => {
      this.assetsStatusDetailType.server = false;
    });
  };

  /**
   * 编译完成后的回调处理栈
   * **/
  public handleMakeComplate(callback) {
    this.event.on("MakeClientComplate", async () => {
      this.assetsStatusDetailType.client = true;
      await callback(this.assetsStatusDetailType);
    });
    this.event.on("MakeServerComplate", async () => {
      this.assetsStatusDetailType.server = true;
      await callback(this.assetsStatusDetailType);
    });
  };

  public startClientMake() {
    this.event.emit("StartMakeClient");
  };

  public complateClientMake() {
    this.event.emit("MakeClientComplate");
  };

  public startServerMake() {
    this.event.emit("StartMakeServer");
  };

  public complateServerMake() {
    this.event.emit("MakeServerComplate");
  };

};

IOCContainer.bind(CompilerProgressService).toSelf().inSingletonScope();