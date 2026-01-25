import path from "path";
import spawn from "cross-spawn";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/commons/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";
import { ServerSiderCompileService } from "@/frameworks/services/compile/ServerSiderCompileService";
import { GenerateSwaggerDocsService } from "@/frameworks/services/preprocess/GenerateSwaggerDocsService";

/**
 * @description 运行开发命令,可以基于cluster同时开启服务端和客户端渲染服务
 * **/
@injectable()
export class DevelopmentControllerProcess {

  private childProcess: spawn;

  constructor(
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager,
    @inject(ServerSiderCompileService) private readonly $ServerSiderCompileService: ServerSiderCompileService,
    @inject(GenerateSwaggerDocsService) private readonly $GenerateSwaggerDocsService: GenerateSwaggerDocsService
  ) { };

  public async execute() {
    const { destnation } = this.$FrameworkConfigManager.getRuntimeConfig();
    /** 开发模式下需要使用watch模式,启动服务端脚本应该在callback中执行 **/
    await this.$ServerSiderCompileService.startWatch(async () => {
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
      this.childProcess = await spawn("node", [path.resolve(destnation, "./server.js")], {
        stdio: "inherit",
        stderr: "inherit"
      });
    });
  };

};

IOCContainer.bind(DevelopmentControllerProcess).toSelf().inSingletonScope();