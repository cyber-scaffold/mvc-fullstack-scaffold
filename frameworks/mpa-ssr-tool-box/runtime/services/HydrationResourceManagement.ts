import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/mpa-ssr-tool-box/runtime/cores/IOCContainer";
import { RuntimeMaterielResourceDatabaseManager } from "@/frameworks/mpa-ssr-tool-box/runtime/commons/RuntimeMaterielResourceDatabaseManager";

import type { CompileAssetsDictionaryType } from "@/frameworks/mpa-ssr-tool-box/public/filterWebpackStats";

export type HydrationCompileAssetsListQueryResult = CompileAssetsDictionaryType | false;

/**
 * 注水物料的资源管理器
 * **/
@injectable()
export class HydrationResourceManagement {

  constructor (
    @inject(RuntimeMaterielResourceDatabaseManager) private readonly $RuntimeMaterielResourceDatabaseManager: RuntimeMaterielResourceDatabaseManager,
  ) { }

  /**
   * 获取注水渲染时涉及到的资源
   * **/
  public async getResourceListByAlias(alias: string): Promise<HydrationCompileAssetsListQueryResult> {
    const hydrationCompileDatabase = this.$RuntimeMaterielResourceDatabaseManager.getHydrationCompileDatabase();
    await hydrationCompileDatabase.read();
    if (hydrationCompileDatabase.data["status"] !== "done") {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return await this.getResourceListByAlias(alias);
    };
    if (!hydrationCompileDatabase.data["assets"]) {
      return false;
    };
    if (!hydrationCompileDatabase.data["assets"][alias]) {
      return false;
    };
    const compileAssetsInfo = hydrationCompileDatabase.data["assets"][alias];
    return compileAssetsInfo;
  };

};

IOCContainer.bind(HydrationResourceManagement).toSelf().inRequestScope();
