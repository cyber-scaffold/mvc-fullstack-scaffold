import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/mpa-ssr-tool-box/runtime/cores/IOCContainer";
import { RuntimeMaterielResourceDatabaseManager } from "@/frameworks/mpa-ssr-tool-box/runtime/commons/RuntimeMaterielResourceDatabaseManager";

import type { CompileAssetsDictionaryType } from "@/frameworks/mpa-ssr-tool-box/public/filterWebpackStats";

export type HydrationCompileAssetsListQueryResult = CompileAssetsDictionaryType | false;

/**
 * 水合化资源的资源管理器
 * 如果源代码发生改变,并且不是开发模式的情况下,获取水合化资源的时候就要重新编译
 * **/
@injectable()
export class HydrationResourceManagement {

  constructor (
    @inject(RuntimeMaterielResourceDatabaseManager) private readonly $RuntimeMaterielResourceDatabaseManager: RuntimeMaterielResourceDatabaseManager,
  ) { }

  /**
   * 先执行完smartDecide之后在运行该函数获取编译记录
   * **/
  public async getResourceListWithAlias(alias: string): Promise<HydrationCompileAssetsListQueryResult> {
    const hydrationCompileDatabase = this.$RuntimeMaterielResourceDatabaseManager.getHydrationCompileDatabase();
    await hydrationCompileDatabase.read();
    if (hydrationCompileDatabase.data["status"] !== "done") {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return await this.getResourceListWithAlias(alias);
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
