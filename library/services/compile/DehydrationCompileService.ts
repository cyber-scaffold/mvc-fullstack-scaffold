import { webpack } from "webpack";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/library/commons/IOCContainer";

import { DehydrationConfigManager } from "@/library/configs/platforms/DehydrationConfigManager";
import { filterWebpackStats } from "@/library/utils/filterWebpackStats";

@injectable()
export class DehydrationCompileService {

  constructor(
    @inject(DehydrationConfigManager) private readonly $DehydrationConfigManager: DehydrationConfigManager
  ) { };

  public async startWatch(sourceCodeFilePath: string) {
    const dehydrationRenderConfig: any = await this.$DehydrationConfigManager.getDevelopmentConfig(sourceCodeFilePath);
    const dehydrationCompiler = webpack(dehydrationRenderConfig);
    dehydrationCompiler.watch({}, (error, stats) => {
      if (error) {
        console.log(error);
      } else {
        return filterWebpackStats(stats.toJson({ all: false, assets: true, outputPath: true }));
      };
    });
  };

  public async startBuild(sourceCodeFilePath: string) {
    const dehydrationRenderConfig: any = await this.$DehydrationConfigManager.getProductionConfig(sourceCodeFilePath);
    const dehydrationCompiler = webpack(dehydrationRenderConfig);
    return new Promise((resolve, reject) => {
      dehydrationCompiler.run((error, stats) => {
        if (error) {
          reject(error);
        } else {
          // console.log(stats.toString({ colors: true }));
          resolve(filterWebpackStats(stats.toJson({ all: false, assets: true, outputPath: true })));
        };
      });
    });
  };

};

IOCContainer.bind(DehydrationCompileService).toSelf().inSingletonScope();