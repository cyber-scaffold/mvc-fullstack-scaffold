import { fromPairs } from "lodash";
import type { Stats, ModuleGraph, Compilation, Dependency, NormalModule, Module } from "webpack";
import { WapperClientToHydrationService } from "@/frameworks/services/preprocess/WapperClientToHydrationService";

export type ModuleDependency = { moduleName: string, moduleDependencie: string[] };
export type ModuleDependencyTuple = ModuleDependency[];

/**
 * 跟踪出被引用到的客户端组件,并生成清单,
 * 根据清单生成临时的wapper清单到临时文件夹,前端编译框架监听这个临时文件
 * 后续webpack也按照原有的目录结构进行输出
 * **/
export class TrackRequirementPlugin {

  private wapperClientToHydrationService: WapperClientToHydrationService

  constructor(wapperClientToHydrationService: WapperClientToHydrationService) {
    this.wapperClientToHydrationService = wapperClientToHydrationService;
  };

  /**
   * 基于tapbel分析出所有文件的依赖图谱
   * **/
  apply(compiler) {
    // compiler.hooks.done.tap("CollectUsedClientModules", async (stats: StatsCompilation) => {
    //   /**
    //    * 只获取modules相关的信息
    //    * **/
    //   const modules: StatsModule[] = stats.toJson({ all: false, modules: true }).modules || [];
    //   /**
    //    * 过滤出引用到的视图层模块列表
    //    * **/
    //   const usedClientModules = await this.wapperClientToHydrationService.filterViewUsedModuleList(modules);
    //   /**
    //    * 把需要进行水合化编译的客户端模块装成临时文件
    //    * 这样就会触发webpack对引用到的前端页面进行编译生成水合化脚本
    //    * **/
    //   this.wapperClientToHydrationService.wapperClientHydration(usedClientModules);
    // });
    compiler.hooks.done.tap("ModuleDependencyGraph", async (stats: Stats) => {
      const compilation: Compilation = stats.compilation;
      /** 获取到webpack的模块图谱 **/
      const moduleGraph: ModuleGraph = compilation.moduleGraph;
      /** 分析各个模块的依赖关系图谱 **/
      const dependenciesGraph = (Array.from((compilation.modules as Set<NormalModule>)).map((everyModule: NormalModule) => {
        if (!everyModule.resource) {
          return false;
        };
        /** 整理当前模块下的依赖项 **/
        const everyModuleDependenciesList = (Array.from((everyModule.dependencies as Dependency[])).map((everyModuleDependencie: Dependency) => {
          const moduleDependencie: null | Module = moduleGraph.getModule(everyModuleDependencie);
          if (!moduleDependencie) {
            return false;
          };
          if ((moduleDependencie as NormalModule).resource === everyModule.resource) {
            return false;
          };
          return (moduleDependencie as NormalModule).resource;
        }).filter(Boolean) as string[]);
        /** 格式化成对象 **/
        return fromPairs([["moduleName", everyModule.resource], ["moduleDependencie", everyModuleDependenciesList]]);
      }).filter(Boolean) as ModuleDependencyTuple);
      /**
       * 从服务端的依赖树中找出需要注水的客户端模块
       * **/
      const usedClientModules = await this.wapperClientToHydrationService.filterViewUsedModuleList(dependenciesGraph);
      /**
       * 把需要进行水合化编译的客户端模块装成临时文件
       * 这样就会触发webpack对引用到的前端页面进行编译生成水合化脚本
       * **/
      this.wapperClientToHydrationService.wapperClientHydration(usedClientModules);
    });
  }
};