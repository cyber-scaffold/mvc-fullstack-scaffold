import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/commons/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";

import { makeHydrationResource, makeDehydratedResource } from "@/library/compilation";

/**
 * 脱水和注水物料的开发模式
 * **/
@injectable()
export class MaterielResourceDevelopmentController {

  private hydration = {};

  private dehydrated = {};

  constructor(
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager
  ) { };

  public async startDevelopmentMode() {
    const { materiels = [] } = await this.$FrameworkConfigManager.getRuntimeConfig();
    materiels.map((everyMaterielInfo) => {
      if (everyMaterielInfo.hydration) {
        this.hydration[everyMaterielInfo.alias] = makeHydrationResource({
          alias: everyMaterielInfo.alias,
          source: everyMaterielInfo.source,
          mode: "development",
          watch: true
        });
      };
      if (everyMaterielInfo.dehydrated) {
        this.dehydrated[everyMaterielInfo.alias] = makeDehydratedResource({
          alias: everyMaterielInfo.alias,
          source: everyMaterielInfo.source,
          mode: "development",
          watch: true
        });
      };
    });
  };

};

IOCContainer.bind(MaterielResourceDevelopmentController).toSelf().inRequestScope();