import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/commons/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";
import { ClientSiderCompileService } from "@/frameworks/services/compile/ClientSiderCompileService";
import { ServerSiderCompileService } from "@/frameworks/services/compile/ServerSiderCompileService";
import { GenerateSwaggerDocsService } from "@/frameworks/services/preprocess/GenerateSwaggerDocsService";

/**
 * @description 运行开发命令,可以基于cluster同时开启服务端和客户端渲染服务
 * **/
@injectable()
export class BuildController {

  constructor(
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager,
    @inject(ClientSiderCompileService) private readonly $ClientSiderCompileService: ClientSiderCompileService,
    @inject(ServerSiderCompileService) private readonly $ServerSiderCompileService: ServerSiderCompileService,
    @inject(GenerateSwaggerDocsService) private readonly $GenerateSwaggerDocsService: GenerateSwaggerDocsService
  ) { };

  public async execute() {
    await this.$ClientSiderCompileService.startBuild();
    await this.$ServerSiderCompileService.startBuild();
    await this.$GenerateSwaggerDocsService.execute();
  };

};

IOCContainer.bind(BuildController).toSelf().inSingletonScope();