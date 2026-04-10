import path from "path";
import spawn from "cross-spawn";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/cores/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";
import { ServerSiderConfigManager } from "@/frameworks/configs/webpack/ServerSiderConfigManager";

import { GenerateSwaggerDocsService } from "@/frameworks/services/GenerateSwaggerDocsService";

import type { Compiler } from "webpack";
import type { ChildProcess } from "child_process";

/**
 * @description 运行开发命令,可以基于cluster同时开启服务端和客户端渲染服务
 * **/
@injectable()
export class ApplicationDevelopmentController {

  private childProcess: ChildProcess;

  constructor (
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager,
    @inject(ServerSiderConfigManager) private readonly $ServerSiderConfigManager: ServerSiderConfigManager,
    @inject(GenerateSwaggerDocsService) private readonly $GenerateSwaggerDocsService: GenerateSwaggerDocsService
  ) { };

  /**
   * 启动应用服务的开发模式
   * **/
  public async startDevelopmentMode(callback) {
    const webpackDevelopmentCompiler: Compiler = await this.$ServerSiderConfigManager.getWebpackDevelopmentCompiler();
    webpackDevelopmentCompiler.watch({ ignored: "**/node_modules/**" }, (error, stats) => {
      // const info = stats.toJson({
      //   modules: true,
      //   reasons: true
      // });
      // const changedModules = info.modules.filter(m => m.built);
      // console.log('重新构建的模块:', changedModules.map(m => m.name));
      if (error) {
        console.log(error);
      } else {
        // console.log(stats.toString({ colors: true }));
        callback();
        return false;
      };
    });
  };

  public async execute() {
    const { assetsDirectoryPath } = this.$FrameworkConfigManager.getRuntimeConfig();
    /** 开发模式下需要使用watch模式,启动服务端脚本应该在callback中执行 **/
    await this.startDevelopmentMode(async () => {
      // if (this.childProcess) {
      //   await new Promise((resolve) => {
      //     const handleClose = () => {
      //       resolve(true);
      //       this.childProcess.removeAllListeners("close");
      //     };
      //     this.childProcess.on("close", handleClose);
      //     this.childProcess.kill("SIGKILL");
      //   });
      //   this.childProcess = undefined;
      //   await new Promise((resolve) => setTimeout(resolve, 100));
      // };
      if (this.childProcess) {
        this.childProcess.kill("SIGKILL");
      };
      await this.$GenerateSwaggerDocsService.execute();
      this.childProcess = await spawn("node", [path.resolve(assetsDirectoryPath, "./server.js")], {
        stdio: "inherit",
        stderr: "inherit"
      });
    });
  };

};

IOCContainer.bind(ApplicationDevelopmentController).toSelf().inSingletonScope();