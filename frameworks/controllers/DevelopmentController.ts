import path from "path";
import spawn from "cross-spawn";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/commons/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";
import { ClientSiderCompileService } from "@/frameworks/services/compile/ClientSiderCompileService";
import { ServerSiderCompileService } from "@/frameworks/services/compile/ServerSiderCompileService";
import { GenerateSwaggerDocsService } from "@/frameworks/services/preprocess/GenerateSwaggerDocsService";
import { CompilerProgressService, AssetsStatusDetailType } from "@/frameworks/services/progress/CompilerProgressService";

/**
 * @description 运行开发命令,可以基于cluster同时开启服务端和客户端渲染服务
 * **/
@injectable()
export class DevelopmentControllerProcess {

  private taskLock: boolean = false;

  private childProcess: spawn;

  constructor(
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager,
    @inject(CompilerProgressService) private readonly $CompilerProgressService: CompilerProgressService,
    @inject(ClientSiderCompileService) private readonly $ClientSiderCompileService: ClientSiderCompileService,
    @inject(ServerSiderCompileService) private readonly $ServerSiderCompileService: ServerSiderCompileService,
    @inject(GenerateSwaggerDocsService) private readonly $GenerateSwaggerDocsService: GenerateSwaggerDocsService
  ) { };

  public async execute() {
    const { destnation } = this.$FrameworkConfigManager.getRuntimeConfig();
    await this.$ClientSiderCompileService.startWatch();
    await this.$ServerSiderCompileService.startWatch();
    this.$CompilerProgressService.handleMakeComplate(async (assetsStatusDetailType: AssetsStatusDetailType) => {
      /** 判断竞争锁 **/
      if (this.taskLock) {
        return false;
      };
      if (!assetsStatusDetailType.client) {
        return false;
      };
      if (!assetsStatusDetailType.server) {
        return false;
      };
      /** 开启竞争锁 **/
      this.taskLock = true;
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
      /** 释放竞争锁 **/
      this.taskLock = false;
    });
  };

};

IOCContainer.bind(DevelopmentControllerProcess).toSelf().inSingletonScope();