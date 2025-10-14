import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/commons/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";
import { ClientSiderRenderService } from "@/frameworks/services/compile/ClientSiderRenderService";
import { ServerSiderRenderService } from "@/frameworks/services/compile/ServerSiderRenderService";
import { GenerateSwaggerDocsService } from "@/frameworks/services/preprocess/GenerateSwaggerDocsService";

/**
 * @description 运行开发命令,可以基于cluster同时开启服务端和客户端渲染服务
 * **/
@injectable()
export class BuildController {

  constructor(
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager,
    @inject(ClientSiderRenderService) private readonly $ClientSiderRenderService: ClientSiderRenderService,
    @inject(ServerSiderRenderService) private readonly $ServerSiderRenderService: ServerSiderRenderService,
    @inject(GenerateSwaggerDocsService) private readonly $GenerateSwaggerDocsService: GenerateSwaggerDocsService
  ) { };

  public async execute() {
    await this.$ClientSiderRenderService.startBuild();
    await this.$ServerSiderRenderService.startBuild();
    await this.$GenerateSwaggerDocsService.execute();
  };

};

IOCContainer.bind(BuildController).toSelf().inSingletonScope();