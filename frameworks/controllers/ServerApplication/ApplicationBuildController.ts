import webpack from "webpack";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/commons/IOCContainer";
import { ServerSiderConfigManager } from "@/frameworks/configs/platforms/ServerSiderConfigManager";
import { GenerateSwaggerDocsService } from "@/frameworks/services/preprocess/GenerateSwaggerDocsService";

/**
 * @description 运行开发命令,可以基于cluster同时开启服务端和客户端渲染服务
 * **/
@injectable()
export class ApplicationBuildController {

  constructor(
    @inject(ServerSiderConfigManager) private readonly $ServerSiderConfigManager: ServerSiderConfigManager,
    @inject(GenerateSwaggerDocsService) private readonly $GenerateSwaggerDocsService: GenerateSwaggerDocsService
  ) { };

  /**
   * 进行应用服务的编译
   * **/
  public async startBuild() {
    const serverSiderRenderConfig: any = await this.$ServerSiderConfigManager.getProductionConfig();
    const serverSiderCompiler = webpack(serverSiderRenderConfig);
    await new Promise((resolve, reject) => {
      serverSiderCompiler.run((error, stats) => {
        if (error) {
          reject(error);
        } else {
          // console.log(stats.toString({ colors: true }));
          resolve(true);
        };
      });
    });
  };

  public async execute() {
    await this.startBuild();
    await this.$GenerateSwaggerDocsService.execute();
  };

};

IOCContainer.bind(ApplicationBuildController).toSelf().inSingletonScope();