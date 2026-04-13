import pathExists from "path-exists";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/mpa-ssr-tool-box/compilation/cores/IOCContainer";
import { CompilationConfigManager } from "@/frameworks/mpa-ssr-tool-box/compilation/commons/CompilationConfigManager";
import { ConvertHydrationEntryFile } from "@/frameworks/mpa-ssr-tool-box/compilation/services/ConvertHydrationEntryFile";
import { HydrationConfigManager } from "@/frameworks/mpa-ssr-tool-box/compilation/configs/webpack/HydrationConfigManager";
import { CompilationMaterielResourceDatabaseManager } from "@/frameworks/mpa-ssr-tool-box/compilation/commons/CompilationMaterielResourceDatabaseManager";

import { filterWebpackStats } from "@/frameworks/mpa-ssr-tool-box/public/filterWebpackStats";

import type { Compiler } from "webpack";

/**
 * 水合化资源的资源管理器
 * 如果源代码发生改变,并且不是开发模式的情况下,获取水合化资源的时候就要重新编译
 * **/
@injectable()
export class MakeHydrationResource {

  constructor (
    @inject(CompilationMaterielResourceDatabaseManager) private readonly $CompilationMaterielResourceDatabaseManager: CompilationMaterielResourceDatabaseManager,
    @inject(ConvertHydrationEntryFile) private readonly $ConvertHydrationEntryFile: ConvertHydrationEntryFile,
    @inject(CompilationConfigManager) private readonly $CompilationConfigManager: CompilationConfigManager,
    @inject(HydrationConfigManager) private readonly $HydrationConfigManager: HydrationConfigManager
  ) { }

  /**
   * 检查物料对应的源文件是否存在
   * 并转换成webpack可以识别的内容清单
   * **/
  public async checkSourceCodeAndTransformer() {
    const { materielArrayList } = this.$CompilationConfigManager.getRuntimeConfig();
    /** 检查物料对应的源文件是否存在 **/
    const materielPairs: [string, string][] = await Promise.all(materielArrayList.map(async (everyMaterielInfo) => {
      if (!await pathExists(everyMaterielInfo.source)) {
        throw new Error(`source code file ${everyMaterielInfo.alias} ==> ${everyMaterielInfo.source} not exist`);
      };
      return [everyMaterielInfo.alias, everyMaterielInfo.source];
    }));
    await this.$ConvertHydrationEntryFile.initialize(materielPairs);
  };

  /**
   * 在watch模式下进行物料制作
   * **/
  public async makeResourceWithWatchMode(): Promise<void | boolean> {
    /** 获取注水物料的编译结果的管理数据库 **/
    const hydrationCompileDatabase = this.$CompilationMaterielResourceDatabaseManager.getHydrationCompileDatabase();
    await hydrationCompileDatabase.write();
    /** 生成编译对象 **/
    const webpackCompiler: Compiler = await this.$HydrationConfigManager.getWebpackDevelopmentCompiler();
    /** 开启一个编译对象 **/
    webpackCompiler.watch({ ignored: "**/node_modules/**" }, async (error, stats) => {
      if (error) {
        console.log(error);
      } else {
        console.log(stats.toString({ colors: true }));
        const latestAssetsFileList = filterWebpackStats(stats.toJson({ all: false, assets: true, source: false, outputPath: true }));
        /** 在json数据库中保存资源信息 **/
        hydrationCompileDatabase.data["assets"] = latestAssetsFileList;
        await hydrationCompileDatabase.write();
      };
    });
  };

  /**
   * 在build模式下进行物料制作
   * **/
  public async makeResourceWithBuildMode(): Promise<void | boolean> {
    const hydrationCompileDatabase = this.$CompilationMaterielResourceDatabaseManager.getHydrationCompileDatabase();
    await hydrationCompileDatabase.write();
    /** 生成编译对象 **/
    const webpackCompiler: any = await this.$HydrationConfigManager.getWebpackProductionCompiler();
    /** 执行编译并记录结果 **/
    webpackCompiler.run(async (error, stats) => {
      if (error) {
        console.log(error);
      } else {
        console.log(stats.toString({ colors: true }));
        const latestAssetsFileList = filterWebpackStats(stats.toJson({ all: false, assets: true, source: false, outputPath: true }));
        /** 在json数据库中保存资源信息 **/
        hydrationCompileDatabase.data["assets"] = latestAssetsFileList;
        await hydrationCompileDatabase.write();
      };
    });
  };

};

IOCContainer.bind(MakeHydrationResource).toSelf().inRequestScope();
