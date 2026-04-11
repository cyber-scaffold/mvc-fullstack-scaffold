import { webpack } from "webpack";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/library/compilation/cores/IOCContainer";

import { CompilationMaterielResourceDatabaseManager } from "@/library/compilation/commons/CompilationMaterielResourceDatabaseManager";
import { DehydrationConfigManager } from "@/library/compilation/configs/webpack/DehydrationConfigManager";
import { filterWebpackStats } from "@/library/public/filterWebpackStats";

import { ClearHistoryService } from "@/library/compilation/services/ClearHistoryService";

import type { Compiler } from "webpack";

@injectable()
export class DehydrationCompileService {

  constructor (
    @inject(CompilationMaterielResourceDatabaseManager) private readonly $CompilationMaterielResourceDatabaseManager: CompilationMaterielResourceDatabaseManager,
    @inject(DehydrationConfigManager) private readonly $DehydrationConfigManager: DehydrationConfigManager,
    @inject(ClearHistoryService) private readonly $ClearHistoryService: ClearHistoryService
  ) { };

  public async startWatch(params) {
    const { alias, mode, sourceCodeFilePath } = params;
    /** 获取脱水物料的编译结果的管理数据库 **/
    const dehydrationCompileDatabase = this.$CompilationMaterielResourceDatabaseManager.getDehydrationCompileDatabase();
    dehydrationCompileDatabase.data[alias] = {};
    await dehydrationCompileDatabase.write();
    /** 获取开发环境下的编译对象 **/
    const webpackCompiler: Compiler = await this.$DehydrationConfigManager.getWebpackDevelopmentCompiler({ alias, sourceCodeFilePath });
    webpackCompiler.watch({ ignored: "**/node_modules/**" }, async (error, stats) => {
      if (error) {
        console.log(error);
      } else {
        // console.log(stats.toString({ colors: true }));
        const latestAssetsFileList = filterWebpackStats(stats.toJson({ all: true, assets: true, source: true, outputPath: true }));
        // console.log(alias, "脱水资源===>", currentAssetsFileList);
        /** 在json数据库中保存资源信息 **/
        dehydrationCompileDatabase.data[alias].javascript = latestAssetsFileList.javascript;
        dehydrationCompileDatabase.data[alias].stylesheet = latestAssetsFileList.stylesheet;
        dehydrationCompileDatabase.data[alias].statics = latestAssetsFileList.statics;
        await dehydrationCompileDatabase.write();
      };
    });
  };

  public async startBuild(params) {
    const { alias, mode, sourceCodeFilePath } = params;
    /** 获取脱水物料的编译结果的管理数据库 **/
    const dehydrationCompileDatabase = this.$CompilationMaterielResourceDatabaseManager.getDehydrationCompileDatabase();
    dehydrationCompileDatabase.data[alias] = {};
    await dehydrationCompileDatabase.write();
    /** 获取开发环境下的编译对象 **/
    const webpackCompiler: any = await this.$DehydrationConfigManager.getWebpackProductionCompiler({ alias, sourceCodeFilePath });
    webpackCompiler.run(async (error, stats) => {
      if (error) {
        console.log(error);
      } else {
        // console.log(stats.toString({ colors: true }));
        const assetsFileList = filterWebpackStats(stats.toJson({ all: true, assets: true, source: true, outputPath: true }));
        /** 在json数据库中保存资源信息 **/
        dehydrationCompileDatabase.data[alias].javascript = assetsFileList.javascript;
        dehydrationCompileDatabase.data[alias].stylesheet = assetsFileList.stylesheet;
        dehydrationCompileDatabase.data[alias].statics = assetsFileList.statics;
        await dehydrationCompileDatabase.write();
      };
    });
  };

};

IOCContainer.bind(DehydrationCompileService).toSelf().inSingletonScope();