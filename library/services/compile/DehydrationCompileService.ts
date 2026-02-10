import { webpack } from "webpack";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/library/commons/IOCContainer";

import { MaterielResourceDatabaseManager } from "@/library/commons/MaterielResourceDatabaseManager";
import { DehydrationConfigManager } from "@/library/configs/platforms/DehydrationConfigManager";
import { filterWebpackStats } from "@/library/utils/filterWebpackStats";

@injectable()
export class DehydrationCompileService {

  constructor(
    @inject(MaterielResourceDatabaseManager) private readonly $MaterielResourceDatabaseManager: MaterielResourceDatabaseManager,
    @inject(DehydrationConfigManager) private readonly $DehydrationConfigManager: DehydrationConfigManager
  ) { };

  public async startWatch(params) {
    const { alias, mode, sourceCodeFilePath } = params;
    /** 获取脱水物料的编译结果的管理数据库 **/
    const dehydrationCompileDatabase = this.$MaterielResourceDatabaseManager.getDehydrationCompileDatabase();
    dehydrationCompileDatabase.data[alias] = {};
    await dehydrationCompileDatabase.write();
    /** 获取开发环境下的编译配置 **/
    const dehydrationRenderConfig: any = await this.$DehydrationConfigManager.getDevelopmentConfig({ alias, sourceCodeFilePath });
    /** 开启一个编译对象 **/
    const dehydrationCompiler = webpack(dehydrationRenderConfig);
    dehydrationCompiler.watch({ ignored: "**/node_modules/**" }, async (error, stats) => {
      if (error) {
        console.log(error);
      } else {
        const assetsFileList = filterWebpackStats(stats.toJson({ all: false, assets: true, outputPath: true }));
        /** 在json数据库中保存资源信息 **/
        dehydrationCompileDatabase.data[alias].javascript = assetsFileList.javascript;
        dehydrationCompileDatabase.data[alias].stylesheet = assetsFileList.stylesheet;
        await dehydrationCompileDatabase.write();
      };
    });
  };

  public async startBuild(params) {
    const { alias, mode, sourceCodeFilePath } = params;
    /** 获取脱水物料的编译结果的管理数据库 **/
    const dehydrationCompileDatabase = this.$MaterielResourceDatabaseManager.getDehydrationCompileDatabase();
    dehydrationCompileDatabase.data[alias] = {};
    await dehydrationCompileDatabase.write();
    /** 获取开发环境下的编译配置 **/
    const dehydrationRenderConfig: any = await this.$DehydrationConfigManager.getProductionConfig({ alias, sourceCodeFilePath });
    /** 开启一个编译对象 **/
    const dehydrationCompiler = webpack(dehydrationRenderConfig);
    dehydrationCompiler.run(async (error, stats) => {
      if (error) {
        console.log(error);
      } else {
        // console.log(stats.toString({ colors: true }));
        const assetsFileList = filterWebpackStats(stats.toJson({ all: false, assets: true, outputPath: true }));
        /** 在json数据库中保存资源信息 **/
        dehydrationCompileDatabase.data[alias].javascript = assetsFileList.javascript;
        dehydrationCompileDatabase.data[alias].stylesheet = assetsFileList.stylesheet;
        await dehydrationCompileDatabase.write();
      };
    });
  };

};

IOCContainer.bind(DehydrationCompileService).toSelf().inSingletonScope();