import { EventManager } from "@/frameworks/commons/EventManager";


export class ClientCompilerProgressPlugin {

  private eventManager: EventManager;

  // 插件的构造函数，可以接收用户传入的选项
  constructor(eventManager: EventManager) {
    this.eventManager = eventManager;
  };

  // apply方法是Webpack插件的入口
  apply(compiler) {
    // 在编译开始时触发
    compiler.hooks.compile.tap("ClientCompilerProgressPlugin", (params) => {
      this.eventManager.emitClientMakeStartEvent();
      // console.log("客户端编译开始");
    });

    // 在资源即将输出前触发
    compiler.hooks.emit.tapAsync("ClientCompilerProgressPlugin", (compilation, callback) => {
      // console.log("客户端资源即将输出");
      // 可以对编译的输出资源进行修改
      callback();
    });

    // 在编译完成时触发
    compiler.hooks.done.tap("ClientCompilerProgressPlugin", (stats) => {
      this.eventManager.emitClientMakeComplateEvent();
      // console.log("客户端编译完成");
    });
  };
};