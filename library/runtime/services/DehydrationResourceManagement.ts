import { injectable, inject } from "inversify";

import { IOCContainer } from "@/library/runtime/cores/IOCContainer";
import { RuntimeMaterielResourceDatabaseManager } from "@/library/runtime/commons/RuntimeMaterielResourceDatabaseManager";

import type { CompileAssetsDictionaryType } from "@/library/public/filterWebpackStats";

export type DehydrationCompileAssetsListQueryResult = CompileAssetsDictionaryType | false;

/**
 * 脱水资源的资源管理器
 * 如果源代码发生改变,并且不是开发模式的情况下,获取脱水资源的时候就要重新编译
 * **/
@injectable()
export class DehydrationResourceManagement {

  constructor (
    @inject(RuntimeMaterielResourceDatabaseManager) private readonly $RuntimeMaterielResourceDatabaseManager: RuntimeMaterielResourceDatabaseManager,
  ) { }

  /**
   * 先执行完smartDecide之后在运行该函数获取编译记录
   * **/
  public async getResourceListWithAlias(alias: string): Promise<DehydrationCompileAssetsListQueryResult> {
    const dehydrationCompileDatabase = this.$RuntimeMaterielResourceDatabaseManager.getDehydrationCompileDatabase();
    await dehydrationCompileDatabase.read();
    if (dehydrationCompileDatabase.data["status"] !== "done") {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return await this.getResourceListWithAlias(alias);
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
