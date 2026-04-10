import webpack from "webpack";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/cores/IOCContainer";
import { ServerSiderConfigManager } from "@/frameworks/configs/webpack/ServerSiderConfigManager";
import { GenerateSwaggerDocsService } from "@/frameworks/services/GenerateSwaggerDocsService";

/**
 * @description 运行开发命令,可以基于cluster同时开启服务端和客户端渲染服务
 * **/
@injectable()
export class ApplicationBuildController {

  constructor (
    @inject(ServerSiderConfigManager) private readonly $ServerSiderConfigManager: ServerSiderConfigManager,
    @inject(GenerateSwaggerDocsService) private readonly $GenerateSwaggerDocsService: GenerateSwaggerDocsService
  ) { };

  /**
   * 进行应用服务的编译
   * **/
  public async startBuild() {
    const webpackProductionCompiler: any = await this.$ServerSiderConfigManager.getWebpackProductionCompiler();
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
  };

  public async execute() {
    await this.startBuild();
    await this.$GenerateSwaggerDocsService.execute();
  };

};

IOCContainer.bind(ApplicationBuildController).toSelf().inSingletonScope();