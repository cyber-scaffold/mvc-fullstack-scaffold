import pathExists from "path-exists";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/mpa-ssr-tool-box/compilation/cores/IOCContainer";
import { CompilationConfigManager } from "@/frameworks/mpa-ssr-tool-box/compilation/commons/CompilationConfigManager";
import { ConvertDehydrationEntryFile } from "@/frameworks/mpa-ssr-tool-box/compilation/services/ConvertDehydrationEntryFile";
import { DehydrationConfigManager } from "@/frameworks/mpa-ssr-tool-box/compilation/configs/webpack/DehydrationConfigManager";
import { CompilationMaterielResourceDatabaseManager } from "@/frameworks/mpa-ssr-tool-box/compilation/commons/CompilationMaterielResourceDatabaseManager";

import { filterWebpackStats } from "@/frameworks/mpa-ssr-tool-box/public/filterWebpackStats";

import type { Compiler } from "webpack";
import type { MaterielCompilationInfoType } from "@/frameworks/mpa-ssr-tool-box/compilation/commons/CompilationConfigManager";

/**
 * 脱水资源的资源管理器
 * 如果源代码发生改变,并且不是开发模式的情况下,获取脱水资源的时候就要重新编译
 * **/
@injectable()
export class MakeDehydrationResource {

  constructor (
    @inject(CompilationMaterielResourceDatabaseManager) private readonly $CompilationMaterielResourceDatabaseManager: CompilationMaterielResourceDatabaseManager,
    @inject(ConvertDehydrationEntryFile) private readonly $ConvertDehydrationEntryFile: ConvertDehydrationEntryFile,
    @inject(CompilationConfigManager) private readonly $CompilationConfigManager: CompilationConfigManager,
    @inject(DehydrationConfigManager) private readonly $DehydrationConfigManager: DehydrationConfigManager
  ) { }

  /**
   * 检查物料对应的源文件是否存在
   * 并转换成webpack可以识别的内容清单
   * **/
  public async checkSourceCodeAndTransformer() {
    const { dehydrateDictionary } = this.$CompilationConfigManager.getRuntimeConfig();
    /** 根据 dehydrateDictionary 来计算需要编译的注水物料 **/
    const materielPairs: [alias: string, detail: MaterielCompilationInfoType][] = await Promise.all(Object.values(dehydrateDictionary).map(async (everyMaterielInfo) => {
      if (!await pathExists(everyMaterielInfo.source)) {
        throw new Error(`source code file ${everyMaterielInfo.alias} ==> ${everyMaterielInfo.source} not exist`);
      };
      return [everyMaterielInfo.alias, everyMaterielInfo];
    }));
    await this.$ConvertDehydrationEntryFile.initialize(materielPairs);
  };

  /**
   * 在watch模式下进行物料制作
   * **/
  public async makeResourceWithWatchMode() {
    /** 获取脱水物料的编译结果的管理数据库 **/
    const dehydrationCompileDatabase = this.$CompilationMaterielResourceDatabaseManager.getDehydrationCompileDatabase();
    await dehydrationCompileDatabase.write();
    /** 获取开发环境下的编译对象 **/
    const webpackCompiler: Compiler = await this.$DehydrationConfigManager.getWebpackDevelopmentCompiler();
    webpackCompiler.watch({ ignored: "**/node_modules/**", aggregateTimeout: 2000, poll: 1000 }, async (error, stats) => {
      if (error) {
        console.log(error);
      } else {
        // console.log(stats.toString({ colors: true }));
        const latestAssetsFileList = filterWebpackStats(stats.toJson({ all: false, assets: true, source: false, outputPath: true }));
        /** 在json数据库中保存资源信息 **/
        dehydrationCompileDatabase.data["assets"] = latestAssetsFileList;
        await dehydrationCompileDatabase.write();
      };
    });
  };

  /**
   * 在build模式下进行物料制作
   * **/
  public async makeResourceWithBuildMode() {
    /** 获取脱水物料的编译结果的管理数据库 **/
    const dehydrationCompileDatabase = this.$CompilationMaterielResourceDatabaseManager.getDehydrationCompileDatabase();
    await dehydrationCompileDatabase.write();
    /** 获取开发环境下的编译对象 **/
    const webpackCompiler: Compiler = await this.$DehydrationConfigManager.getWebpackProductionCompiler();
    webpackCompiler.run(async (error, stats) => {
      if (error) {
        console.log(error);
      } else {
        // console.log(stats.toString({ colors: true }));
        const latestAssetsFileList = filterWebpackStats(stats.toJson({ all: false, assets: true, source: false, outputPath: true }));
        /** 在json数据库中保存资源信息 **/
        dehydrationCompileDatabase.data["assets"] = latestAssetsFileList;
        await dehydrationCompileDatabase.write();
      };
    });
  };

};

IOCContainer.bind(MakeDehydrationResource).toSelf().inRequestScope();
