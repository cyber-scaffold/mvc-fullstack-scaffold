import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/cores/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";
import { setCompileConfiguration, makeHydrationResource, makeDehydratedResource } from "@/library/compilation";


/**
 * 在构建模式下制作脱水和注水物料的控制器
 * **/
@injectable()
export class MakeMaterielResourceBuildController {

  constructor (
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager
  ) { };

  public async buildMaterielResource() {
    const { projectDirectoryPath, assetsDirectoryName, materiels = [] } = await this.$FrameworkConfigManager.getRuntimeConfig();
    await setCompileConfiguration({ projectDirectoryPath, assetsDirectoryName });
    /** 对每一组物料的详细编译信息进行分析生成编译队列 **/
    const allMaterielsMakeTask = materiels.map((everyMaterielInfo) => {
      const everyMaterielMakeTask = [];
      if (everyMaterielInfo.hydration) {
        everyMaterielMakeTask.push(makeHydrationResource({
          alias: everyMaterielInfo.alias,
          source: everyMaterielInfo.source,
          mode: "production",
          watch: false
        }));
      };
      if (everyMaterielInfo.dehydrated) {
        everyMaterielMakeTask.push(makeDehydratedResource({
          alias: everyMaterielInfo.alias,
          source: everyMaterielInfo.source,
          mode: "production",
          watch: false
        }));
      };
      return everyMaterielMakeTask;
    });
    /** allMaterielsMakeTask是有分组的二维数组,如果要配合Promise.all的话需要进行flat处理 **/
    await Promise.all(allMaterielsMakeTask.flat());
  };

};

IOCContainer.bind(MakeMaterielResourceBuildController).toSelf().inRequestScope();