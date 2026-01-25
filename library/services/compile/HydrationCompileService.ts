import { webpack } from "webpack";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/library/commons/IOCContainer";

import { HydrationConfigManager } from "@/library/configs/platforms/HydrationConfigManager";
import { filterWebpackStats } from "@/library/utils/filterWebpackStats";


@injectable()
export class HydrationCompileService {

  constructor(
    @inject(HydrationConfigManager) private readonly $HydrationConfigManager: HydrationConfigManager
  ) { };


  public async startBuild(sourceCodeFilePath: string) {
    const hydrationRenderConfig: any = await this.$HydrationConfigManager.getFinallyConfig(sourceCodeFilePath);
    const hydrationCompiler = webpack(hydrationRenderConfig);
    return new Promise((resolve, reject) => {
      hydrationCompiler.run(async (error, stats) => {
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

IOCContainer.bind(HydrationCompileService).toSelf().inRequestScope();