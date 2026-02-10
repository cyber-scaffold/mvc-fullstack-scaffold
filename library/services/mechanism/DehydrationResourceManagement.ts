import pathExists from "path-exists";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/library/commons/IOCContainer";
import { MaterielResourceDatabaseManager } from "@/library/commons/MaterielResourceDatabaseManager";

import { DehydrationCompileService } from "@/library/services/compile/DehydrationCompileService";
import { ResourceManagementInterface } from "@/library/services/mechanism/ResourceManagementInterface";

/**
 * 脱水资源的资源管理器
 * 如果源代码发生改变,并且不是开发模式的情况下,获取脱水资源的时候就要重新编译
 * **/
@injectable()
export class DehydrationResourceManagement implements ResourceManagementInterface {

  private sourceCodeFilePath: string;

  constructor(
    @inject(MaterielResourceDatabaseManager) private readonly $MaterielResourceDatabaseManager: MaterielResourceDatabaseManager,
    @inject(DehydrationCompileService) private readonly $DehydrationCompileService: DehydrationCompileService
  ) { }

  /**
   * 关联源代码同时做个资源检测,如果不存在的话需要提示
   * **/
  public async checkSourceCodeAndRelation(sourceCodeFilePath: string) {
    if (!await pathExists(sourceCodeFilePath)) {
      throw new Error(`源代码文件${sourceCodeFilePath}不存在`);
    };
    this.sourceCodeFilePath = sourceCodeFilePath;
  };

  /**
   * 判断源代码是否有编译记录,没有编译记录并且允许编译的情况下就会自动触发编译
   * **/
  public async buildResourceWithUniqueAlias({ alias, mode, watch }) {
    if (watch) {
      /** 在watch模式下进行编译 **/
      await this.$DehydrationCompileService.startWatch({ alias, mode, sourceCodeFilePath: this.sourceCodeFilePath });
    } else {
      /** 在非watch模式下进行编译 **/
      await this.$DehydrationCompileService.startBuild({ alias, mode, sourceCodeFilePath: this.sourceCodeFilePath });
    };
  };

  /**
   * 先执行完smartDecide之后在运行该函数获取编译记录
   * **/
  public async getResourceListWithAlias(alias: string) {
    const dehydrationCompileDatabase = this.$MaterielResourceDatabaseManager.getDehydrationCompileDatabase();
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
