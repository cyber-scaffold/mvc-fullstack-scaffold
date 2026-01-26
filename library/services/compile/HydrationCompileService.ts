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

  public async startWatch(sourceCodeFilePath: string) {
    /** 获取开发环境下的编译配置 **/
    const hydrationRenderConfig: any = await this.$HydrationConfigManager.getDevelopmentConfig(sourceCodeFilePath);
    /** 开启一个编译对象 **/
    const hydrationCompiler = webpack(hydrationRenderConfig);
    hydrationCompiler.watch({}, async (error, stats) => {
      if (error) {
        console.log(error);
      } else {
        return filterWebpackStats(stats.toJson({ all: false, assets: true, outputPath: true }));
      };
    });
  };

  public async startBuild(sourceCodeFilePath: string) {
    const hydrationRenderConfig: any = await this.$HydrationConfigManager.getProductionConfig(sourceCodeFilePath);
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