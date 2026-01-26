import { get } from "dot-prop";
import pathExists from "path-exists";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/library/commons/IOCContainer";
import { CompileDatabaseManager } from "@/library/commons/CompileDatabaseManager";

import { HydrationCompileService } from "@/library/services/compile/HydrationCompileService";
import { HydrationRenderWapperService } from "@/library/services/preprocess/HydrationRenderWapperService";

import { ResourceManagementInterface } from "@/library/services/mechanism/ResourceManagementInterface";
import { getContentHash } from "@/library/utils/getContentHash";

/**
 * 水合化资源的资源管理器
 * 如果源代码发生改变,并且不是开发模式的情况下,获取水合化资源的时候就要重新编译
 * **/
@injectable()
export class HydrationResourceManagement implements ResourceManagementInterface {

  private sourceCodeFilePath: string;

  constructor(
    @inject(HydrationRenderWapperService) private readonly $HydrationRenderWapperService: HydrationRenderWapperService,
    @inject(HydrationCompileService) private readonly $HydrationCompileService: HydrationCompileService,
    @inject(CompileDatabaseManager) private readonly $CompileDatabaseManager: CompileDatabaseManager
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
  public async smartDecideWithUniqueAlias(alias: string): Promise<void | boolean> {
    /** 计算源代码的contenthash **/
    const sourceCodeContentHash = await getContentHash(this.sourceCodeFilePath);
    /** 获取缓存的编译信息 **/
    const cachedResourceInfo = await this.getResourceList();
    /** 源代码内容没有发生变动的情况则不需要触发编译 **/
    if (get(cachedResourceInfo, "contenthash", undefined) === sourceCodeContentHash) {
      return false;
    };
    /** 源代码内容发生变动的情况需要触发编译并更新编译信息 **/
    const hydrationCompileDatabase = this.$CompileDatabaseManager.getHydrationCompileDatabase();
    const composeTemporaryRenderFilePath = await this.$HydrationRenderWapperService.generateComposeTemporaryRenderFile(this.sourceCodeFilePath);
    const assetsFileList = await this.$HydrationCompileService.startBuild(composeTemporaryRenderFilePath);
    hydrationCompileDatabase.data[this.sourceCodeFilePath] = {
      contenthash: sourceCodeContentHash,
      assets: assetsFileList
    };
    await hydrationCompileDatabase.write();
  };

  /**
   * 先执行完smartDecide之后在运行该函数获取编译记录
   * **/
  public async getResourceList() {
    const hydrationCompileDatabase = this.$CompileDatabaseManager.getHydrationCompileDatabase();
    await hydrationCompileDatabase.read();
    const compileAssetsInfo = hydrationCompileDatabase.data[this.sourceCodeFilePath];
    return compileAssetsInfo;
  };

};

IOCContainer.bind(HydrationResourceManagement).toSelf().inRequestScope();
