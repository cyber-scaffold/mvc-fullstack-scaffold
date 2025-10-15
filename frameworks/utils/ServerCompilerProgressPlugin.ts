import { EventManager } from "@/frameworks/commons/EventManager";

export class ServerCompilerProgressPlugin {

  private eventManager: EventManager;

  // 插件的构造函数，可以接收用户传入的选项
  constructor(eventManager: EventManager) {
    this.eventManager = eventManager;
  };

  // apply方法是Webpack插件的入口
  apply(compiler) {
    // 在编译开始时触发
    compiler.hooks.compile.tap("ServerCompilerProgressPlugin", (params) => {
      this.eventManager.emitServerMakeStartEvent();
      // console.log("服务端编译开始");
    });

    // 在资源即将输出前触发
    compiler.hooks.emit.tapAsync("ServerCompilerProgressPlugin", (compilation, callback) => {
      // console.log("服务端资源即将输出");
      // 可以对编译的输出资源进行修改
      callback();
    });

    // 在编译完成时触发
    compiler.hooks.done.tap("ServerCompilerProgressPlugin", (stats) => {
      this.eventManager.emitServerMakeComplateEvent();
      // console.log("服务端编译完成");
    });
  };
};