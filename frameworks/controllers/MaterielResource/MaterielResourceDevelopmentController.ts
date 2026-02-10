import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/commons/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";
import { compileConfiguration, makeHydrationResource, makeDehydratedResource } from "@/library/compilation";

/**
 * 脱水和注水物料的开发模式
 * **/
@injectable()
export class MaterielResourceDevelopmentController {

  constructor(
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager
  ) { };

  public async startDevelopmentMode() {
    const { projectDirectoryPath, assetsDirectoryName, materiels = [] } = await this.$FrameworkConfigManager.getRuntimeConfig();
    await compileConfiguration({ projectDirectoryPath, assetsDirectoryName });
    /** 对每一组物料的详细编译信息进行分析生成编译队列 **/
    const allMaterielsMakeTask = materiels.map((everyMaterielInfo) => {
      const everyMaterielMakeTask = [];
      if (everyMaterielInfo.hydration) {
        everyMaterielMakeTask.push(makeHydrationResource({
          alias: everyMaterielInfo.alias,
          source: everyMaterielInfo.source,
          mode: "development",
          watch: true
        }));
      };
      if (everyMaterielInfo.dehydrated) {
        everyMaterielMakeTask.push(makeDehydratedResource({
          alias: everyMaterielInfo.alias,
          source: everyMaterielInfo.source,
          mode: "development",
          watch: true
        }));
      };
      return everyMaterielMakeTask;
    });
    /** allMaterielsMakeTask是有分组的二维数组,如果要配合Promise.all的话需要进行flat处理 **/
    await Promise.all(allMaterielsMakeTask.flat());
  };

};

IOCContainer.bind(MaterielResourceDevelopmentController).toSelf().inRequestScope();