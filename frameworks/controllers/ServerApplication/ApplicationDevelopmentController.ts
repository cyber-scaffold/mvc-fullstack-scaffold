import path from "path";
import webpack from "webpack";
import spawn from "cross-spawn";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/commons/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";
import { ServerSiderConfigManager } from "@/frameworks/configs/platforms/ServerSiderConfigManager";
import { GenerateSwaggerDocsService } from "@/frameworks/services/preprocess/GenerateSwaggerDocsService";

/**
 * @description 运行开发命令,可以基于cluster同时开启服务端和客户端渲染服务
 * **/
@injectable()
export class ApplicationDevelopmentController {

  private childProcess: spawn;

  constructor(
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager,
    @inject(ServerSiderConfigManager) private readonly $ServerSiderConfigManager: ServerSiderConfigManager,
    @inject(GenerateSwaggerDocsService) private readonly $GenerateSwaggerDocsService: GenerateSwaggerDocsService
  ) { };

  /**
   * 启动应用服务的开发模式
   * **/
  public async startDevelopmentMode(callback) {
    const serverSiderRenderConfig: any = await this.$ServerSiderConfigManager.getDevelopmentConfig();
    const serverSiderCompiler = webpack(serverSiderRenderConfig);
    serverSiderCompiler.watch({ ignored: "**/node_modules/**" }, (error, stats) => {
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
      if (this.childProcess) {
        await new Promise((resolve) => {
          const handleClose = () => {
            resolve(true);
            this.childProcess.removeAllListeners("close");
          };
          this.childProcess.on("close", handleClose);
          this.childProcess.kill("SIGKILL");
        });
        this.childProcess = undefined;
        await new Promise((resolve) => setTimeout(resolve, 100));
      };
      await this.$GenerateSwaggerDocsService.execute();
      this.childProcess = await spawn("node", [path.resolve(assetsDirectoryPath, "./server.js")], {
        // cwd: path.resolve(process.cwd(), "./dist/"),
        stdio: "inherit",
        stderr: "inherit"
      });
    });
  };

};

IOCContainer.bind(ApplicationDevelopmentController).toSelf().inSingletonScope();