import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/mpa-ssr-build-tool/cores/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/mpa-ssr-build-tool/commons/FrameworkConfigManager";
import { setCompileConfiguration, makeHydrationResource, makeDehydratedResource } from "@/frameworks/mpa-ssr-tool-box/compilation";


/**
 * 在构建模式下制作脱水和注水物料的控制器
 * **/
@injectable()
export class MakeMaterielResource {

  constructor (
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager
  ) { };

  public async buildMaterielResourceByDevelopmentAndWatch() {
    const { projectDirectoryPath, assetsDirectoryName, dehydrateIncludePackageList, dehydrateExcludePackageList, materiels } = await this.$FrameworkConfigManager.getRuntimeConfig();
    await setCompileConfiguration({ projectDirectoryPath, assetsDirectoryName, dehydrateIncludePackageList, dehydrateExcludePackageList, materiels });
    await Promise.all([
      makeHydrationResource({ mode: "development", watch: true }),
      makeDehydratedResource({ mode: "development", watch: true })
    ]);
  };

  public async buildMaterielResourceByProductionNotWatch() {
    const { projectDirectoryPath, assetsDirectoryName, dehydrateIncludePackageList, dehydrateExcludePackageList, materiels } = await this.$FrameworkConfigManager.getRuntimeConfig();
    await setCompileConfiguration({ projectDirectoryPath, assetsDirectoryName, dehydrateIncludePackageList, dehydrateExcludePackageList, materiels });
    await Promise.all([
      makeHydrationResource({ mode: "production", watch: false }),
      makeDehydratedResource({ mode: "production", watch: false })
    ]);
  };

};

IOCContainer.bind(MakeMaterielResource).toSelf().inRequestScope();