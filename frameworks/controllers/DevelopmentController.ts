import path from "path";
import spawn from "cross-spawn";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/commons/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";
import { ClientSiderRenderService } from "@/frameworks/services/ClientSiderRenderService";
import { ServerSiderRenderService } from "@/frameworks/services/ServerSiderRenderService";
import { GenerateSwaggerDocsService } from "@/frameworks/services/GenerateSwaggerDocsService";
import { CompilerProgressService, AssetsStatusDetailType } from "@/frameworks/services/CompilerProgressService";

/**
 * @description 运行开发命令,可以基于cluster同时开启服务端和客户端渲染服务
 * **/
@injectable()
export class DevelopmentControllerProcess {

  private childProcess: spawn;

  constructor(
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager,
    @inject(CompilerProgressService) private readonly $CompilerProgressService: CompilerProgressService,
    @inject(ClientSiderRenderService) private readonly $ClientSiderRenderService: ClientSiderRenderService,
    @inject(ServerSiderRenderService) private readonly $ServerSiderRenderService: ServerSiderRenderService,
    @inject(GenerateSwaggerDocsService) private readonly $GenerateSwaggerDocsService: GenerateSwaggerDocsService
  ) { };

  public async execute() {
    const { destnation } = this.$FrameworkConfigManager.getRuntimeConfig();
    await this.$ClientSiderRenderService.startWatch();
    await this.$ServerSiderRenderService.startWatch();
    this.$CompilerProgressService.handleMakeComplate(async (assetsStatusDetailType: AssetsStatusDetailType) => {
      if (!assetsStatusDetailType.client) {
        return false;
      };
      if (!assetsStatusDetailType.server) {
        return false;
      };
      if (this.childProcess) {
        this.childProcess.kill();
      };
      await this.$GenerateSwaggerDocsService.execute();
      this.childProcess = spawn("node", [path.resolve(destnation, "./server.js")], {
        stdio: "inherit",
        stderr: "inherit"
      });
    });
  };

};

IOCContainer.bind(DevelopmentControllerProcess).toSelf().inSingletonScope();