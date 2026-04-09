import { injectable, inject } from "inversify";

import { IOCContainer } from "@/library/runtime/cores/IOCContainer";
import { RuntimeMaterielResourceDatabaseManager } from "@/library/runtime/commons/RuntimeMaterielResourceDatabaseManager";

import { ResourceManagementInterface } from "@/library/public/ResourceManagementInterface";

/**
 * 脱水资源的资源管理器
 * 如果源代码发生改变,并且不是开发模式的情况下,获取脱水资源的时候就要重新编译
 * **/
@injectable()
export class DehydrationResourceManagement implements ResourceManagementInterface {

  constructor (
    @inject(RuntimeMaterielResourceDatabaseManager) private readonly $RuntimeMaterielResourceDatabaseManager: RuntimeMaterielResourceDatabaseManager,
  ) { }

  /**
   * 先执行完smartDecide之后在运行该函数获取编译记录
   * **/
  public async getResourceListWithAlias(alias: string) {
    const dehydrationCompileDatabase = this.$RuntimeMaterielResourceDatabaseManager.getDehydrationCompileDatabase();
    await dehydrationCompileDatabase.read();
    if (dehydrationCompileDatabase.data[alias].status === "done") {
      const compileAssetsInfo = dehydrationCompileDatabase.data[alias];
      return compileAssetsInfo;
    };
    await new Promise((resolve) => setTimeout(resolve, 100));
    return await this.getResourceListWithAlias(alias);
  };

};

IOCContainer.bind(DehydrationResourceManagement).toSelf().inRequestScope();
