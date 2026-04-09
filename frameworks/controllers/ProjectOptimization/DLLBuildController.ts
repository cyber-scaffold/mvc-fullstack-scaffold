import webpack from "webpack";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/cores/IOCContainer";
import { DLLConfigManager } from "@/frameworks/configs/webpack/DLLConfigManager";

/**
 * @description 运行开发命令,可以基于cluster同时开启服务端和客户端渲染服务
 * **/
@injectable()
export class DLLBuildController {

  constructor (
    @inject(DLLConfigManager) private readonly $DLLConfigManager: DLLConfigManager
  ) { };

  /**
   * 进行应用服务的编译
   * **/
  public async startBuild() {
    const serverSiderRenderConfig: any = await this.$DLLConfigManager.getProductionConfig();
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
  };

};

IOCContainer.bind(DLLBuildController).toSelf().inSingletonScope();