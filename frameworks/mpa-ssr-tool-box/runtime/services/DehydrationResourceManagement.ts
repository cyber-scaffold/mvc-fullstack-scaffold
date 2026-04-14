import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/mpa-ssr-tool-box/runtime/cores/IOCContainer";
import { RuntimeMaterielResourceDatabaseManager } from "@/frameworks/mpa-ssr-tool-box/runtime/commons/RuntimeMaterielResourceDatabaseManager";

import type { CompileAssetsDictionaryType } from "@/frameworks/mpa-ssr-tool-box/public/ResourceManager.d";

export type DehydrationCompileAssetsListQueryResult = CompileAssetsDictionaryType | false;

/**
 * 脱水物料的资源管理器
 * **/
@injectable()
export class DehydrationResourceManagement {

  constructor (
    @inject(RuntimeMaterielResourceDatabaseManager) private readonly $RuntimeMaterielResourceDatabaseManager: RuntimeMaterielResourceDatabaseManager,
  ) { }

  /**
   * 获取脱水渲染时涉及到的资源
   * **/
  public async getResourceListByAlias(alias: string): Promise<DehydrationCompileAssetsListQueryResult> {
    const dehydrationCompileDatabase = this.$RuntimeMaterielResourceDatabaseManager.getDehydrationCompileDatabase();
    await dehydrationCompileDatabase.read();
    if (dehydrationCompileDatabase.data["status"] !== "done") {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return await this.getResourceListByAlias(alias);
    };
    if (!dehydrationCompileDatabase.data["assets"]) {
      return false;
    };
    if (!dehydrationCompileDatabase.data["assets"][alias]) {
      return false;
    };
    const compileAssetsInfo = dehydrationCompileDatabase.data["assets"][alias];
    return compileAssetsInfo;
  };

};

IOCContainer.bind(DehydrationResourceManagement).toSelf().inRequestScope();
