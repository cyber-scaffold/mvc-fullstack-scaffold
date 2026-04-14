import path from "path";
import spawn from "cross-spawn";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/mpa-ssr-build-tool/cores/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/mpa-ssr-build-tool/commons/FrameworkConfigManager";
import { ServerSiderConfigManager } from "@/frameworks/mpa-ssr-build-tool/configs/webpack/ServerSiderConfigManager";
import { ServerProjectVirtualFile } from "@/frameworks/mpa-ssr-build-tool/services/ServerProjectVirtualFile";
import { GenerateSwaggerDocsService } from "@/frameworks/mpa-ssr-build-tool/services/GenerateSwaggerDocsService";

import type { Compiler } from "webpack";
import type { ChildProcess } from "child_process";

/**
 * @description 运行开发命令,可以基于cluster同时开启服务端和客户端渲染服务
 * **/
@injectable()
export class MakeServerApplication {

  private childProcess: ChildProcess;

  constructor (
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager,
    @inject(ServerSiderConfigManager) private readonly $ServerSiderConfigManager: ServerSiderConfigManager,
    @inject(ServerProjectVirtualFile) private readonly $ServerProjectVirtualFile: ServerProjectVirtualFile,
    @inject(GenerateSwaggerDocsService) private readonly $GenerateSwaggerDocsService: GenerateSwaggerDocsService
  ) { };

  /**
   * 启动应用服务的开发模式
   * **/
  public async bootstrapByDevelopmentMode() {
    const { assetsDirectoryPath } = this.$FrameworkConfigManager.getRuntimeConfig();
    await this.$ServerProjectVirtualFile.initialize();
    const webpackDevelopmentCompiler: Compiler = await this.$ServerSiderConfigManager.getWebpackDevelopmentCompiler();
    webpackDevelopmentCompiler.watch({ ignored: "**/node_modules/**" }, async (error, stats) => {
      if (error) {
        console.log(error);
      } else {
        // console.log(stats.toString({ colors: true }));
        if (this.childProcess) {
          this.childProcess.kill("SIGKILL");
        };
        await this.$GenerateSwaggerDocsService.execute();
        this.childProcess = await spawn("node", [path.resolve(assetsDirectoryPath, "./server.js")], {
          stdio: "inherit",
          stderr: "inherit"
        });
        return false;
      };
    });
  };

  /**
   * 进行应用服务的编译
   * **/
  public async startBuild() {
    const webpackProductionCompiler: Compiler = await this.$ServerSiderConfigManager.getWebpackProductionCompiler();
    await this.$ServerProjectVirtualFile.initialize();
    await new Promise((resolve, reject) => {
      webpackProductionCompiler.run((error, stats) => {
        if (error) {
          reject(error);
        } else {
          // console.log(stats.toString({ colors: true }));
          resolve(true);
        };
      });
    });
    await this.$GenerateSwaggerDocsService.execute();
  };

};

IOCContainer.bind(MakeServerApplication).toSelf().inSingletonScope();



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