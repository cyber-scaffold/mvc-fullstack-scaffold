import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/cores/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";
import { setCompileConfiguration, makeHydrationResource, makeDehydratedResource } from "@/library/compilation";


/**
 * 在构建模式下制作脱水和注水物料的控制器
 * **/
@injectable()
export class MakeMaterielResource {

  constructor (
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager
  ) { };

  public async startDevelopmentMode() {
    const { projectDirectoryPath, assetsDirectoryName, materiels } = await this.$FrameworkConfigManager.getRuntimeConfig();
    await setCompileConfiguration({ projectDirectoryPath, assetsDirectoryName, materiels });
    await Promise.all([makeHydrationResource({ mode: "development", watch: true }), makeDehydratedResource({ mode: "development", watch: true })]);
  };

  public async buildMaterielResource() {
    const { projectDirectoryPath, assetsDirectoryName, materiels } = await this.$FrameworkConfigManager.getRuntimeConfig();
    await setCompileConfiguration({ projectDirectoryPath, assetsDirectoryName, materiels });
    await Promise.all([makeHydrationResource({ mode: "production", watch: false }), makeDehydratedResource({ mode: "production", watch: false })]);
  };

};

IOCContainer.bind(MakeMaterielResource).toSelf().inRequestScope();