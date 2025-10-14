import { CompilerProgressService } from "@/frameworks/services/progress/CompilerProgressService";

export class ClientCompilerProgressPlugin {

  private compilerProgress: CompilerProgressService;

  // 插件的构造函数，可以接收用户传入的选项
  constructor(compilerProgress: CompilerProgressService) {
    this.compilerProgress = compilerProgress;
  };

  // apply方法是Webpack插件的入口
  apply(compiler) {
    // 在编译开始时触发
    compiler.hooks.compile.tap("ClientCompilerProgressPlugin", (params) => {
      this.compilerProgress.startClientMake();
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
      this.compilerProgress.complateClientMake();
      // console.log("客户端编译完成");
    });
  };
};