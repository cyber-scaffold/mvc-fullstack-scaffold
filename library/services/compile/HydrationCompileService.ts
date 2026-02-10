import { webpack } from "webpack";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/library/commons/IOCContainer";

import { MaterielResourceDatabaseManager } from "@/library/commons/MaterielResourceDatabaseManager";
import { HydrationRenderWapperService } from "@/library/services/preprocess/HydrationRenderWapperService";
import { HydrationConfigManager } from "@/library/configs/platforms/HydrationConfigManager";
import { filterWebpackStats } from "@/library/utils/filterWebpackStats";


@injectable()
export class HydrationCompileService {

  constructor(
    @inject(MaterielResourceDatabaseManager) private readonly $MaterielResourceDatabaseManager: MaterielResourceDatabaseManager,
    @inject(HydrationRenderWapperService) private readonly $HydrationRenderWapperService: HydrationRenderWapperService,
    @inject(HydrationConfigManager) private readonly $HydrationConfigManager: HydrationConfigManager
  ) { };

  public async startWatch(params) {
    const { alias, mode, sourceCodeFilePath } = params;
    /** 获取注水物料的编译结果的管理数据库 **/
    const hydrationCompileDatabase = this.$MaterielResourceDatabaseManager.getHydrationCompileDatabase();
    hydrationCompileDatabase.data[alias] = {};
    await hydrationCompileDatabase.write();
    /** 需要对原始的tsx文件进行额外加工使其的引用变成标准化的引用 **/
    const composeTemporaryRenderFilePath = await this.$HydrationRenderWapperService.generateStandardizationHydrationFile(sourceCodeFilePath);
    /** 获取开发环境下的编译配置 **/
    const hydrationRenderConfig: any = await this.$HydrationConfigManager.getDevelopmentConfig({ alias, sourceCodeFilePath: composeTemporaryRenderFilePath });
    /** 开启一个编译对象 **/
    const hydrationCompiler = webpack(hydrationRenderConfig);
    hydrationCompiler.watch({ ignored: "**/node_modules/**" }, async (error, stats) => {
      if (error) {
        console.log(error);
      } else {
        // console.log(stats.toString({ colors: true }));
        const assetsFileList = filterWebpackStats(stats.toJson({ all: false, assets: true, outputPath: true }));
        /** 在json数据库中保存资源信息 **/
        hydrationCompileDatabase.data[alias].javascript = assetsFileList.javascript;
        hydrationCompileDatabase.data[alias].stylesheet = assetsFileList.stylesheet;
        await hydrationCompileDatabase.write();
      };
    });
  };

  public async startBuild(params) {
    const { alias, mode, sourceCodeFilePath } = params;
    /** 获取注水物料的编译结果的管理数据库 **/
    const hydrationCompileDatabase = this.$MaterielResourceDatabaseManager.getHydrationCompileDatabase();
    hydrationCompileDatabase.data[alias] = {};
    await hydrationCompileDatabase.write();
    /** 需要对原始的tsx文件进行额外加工使其的引用变成标准化的引用 **/
    const composeTemporaryRenderFilePath = await this.$HydrationRenderWapperService.generateStandardizationHydrationFile(sourceCodeFilePath);
    /** 生成编译配置 **/
    const hydrationRenderConfig: any = await this.$HydrationConfigManager.getProductionConfig({ alias, sourceCodeFilePath: composeTemporaryRenderFilePath });
    /** 生成编译对象 **/
    const hydrationCompiler = webpack(hydrationRenderConfig);
    /**  执行编译并记录结果 **/
    hydrationCompiler.run(async (error, stats) => {
      if (error) {
        console.log(error);
      } else {
        // console.log(stats.toString({ colors: true }));
        const assetsFileList = filterWebpackStats(stats.toJson({ all: false, assets: true, outputPath: true }));
        /** 在json数据库中保存资源信息 **/
        hydrationCompileDatabase.data[alias].javascript = assetsFileList.javascript;
        hydrationCompileDatabase.data[alias].stylesheet = assetsFileList.stylesheet;
        await hydrationCompileDatabase.write();
      };
    });
  };

};

IOCContainer.bind(HydrationCompileService).toSelf().inRequestScope();