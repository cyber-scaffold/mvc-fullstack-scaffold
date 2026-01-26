import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/commons/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";
import { compileConfiguration, makeHydrationResource, makeDehydratedResource } from "@/library";


/**
 * 脱水和注水物料的构建
 * **/
@injectable()
export class MaterielResourceBuildController {

  constructor(
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager
  ) { };

  public async buildMaterielResource() {
    await compileConfiguration()
    const { materiels = [] } = await this.$FrameworkConfigManager.getRuntimeConfig();
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

IOCContainer.bind(MaterielResourceBuildController).toSelf().inRequestScope();