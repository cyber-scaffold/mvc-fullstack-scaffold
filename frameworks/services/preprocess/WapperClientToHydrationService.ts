import path from "path";
import { promisify } from "util";
import { fromPairs } from "lodash";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/commons/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";
import type { ModuleDependency, ModuleDependencyTuple } from "@/frameworks/utils/TrackRequirementPlugin";

/**
 * 该模块用于处理服务端使用到的视图层组件
 * 将这些引用到的组件包装成水合化脚本写入到临时文件夹中
 * 这些包装之后的水合化脚本会触发webpack打包
 * 这个类是搭配自定义 TrackRequirementPlugin 使用的
 * **/
@injectable()
export class WapperClientToHydrationService {

  constructor(
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager
  ) { };

  /**
   * 供 TrackRequirementPlugin 使用的过滤出视图层模块列表的方法
   * **/
  public async filterViewUsedModuleList(moduleDependencyTuple: ModuleDependencyTuple): Promise<string[]> {
    const { serverCompilerConfig, clinetCompilerConfig } = await this.$FrameworkConfigManager.getRuntimeConfig();
    const usedClientModules = (moduleDependencyTuple.map(({ moduleName, moduleDependencie }: ModuleDependency) => {
      /** 忽略非服务端的文件和依赖关系 **/
      if (!moduleName.match(serverCompilerConfig.source)) {
        return false;
      };

      return (moduleDependencie.map((everyModuleDependencyName: string) => {
        /** 基于模块的绝对路径来判断是否属于视图层模块 **/
        if (everyModuleDependencyName.match(clinetCompilerConfig.source) && everyModuleDependencyName.match(/\.{ts|tsx|js|jsx}/)) {
          return everyModuleDependencyName;
        };
      }).filter(Boolean) as string[]);
    }).filter(Boolean).flat() as string[]);
    return usedClientModules || [];
  };

  /**
   * 服务端编译之后需要进行水合化编译的客户端组件
   * 把需要进行水合化编译的客户端组件包装成临时文件
   * **/
  public async wapperClientHydration(sourceCodeAbsolutePathList: string[]) {
    const { tempHydrationDirectory, clinetCompilerConfig } = await this.$FrameworkConfigManager.getRuntimeConfig();
    const sourceCodeRelativePathList = fromPairs(sourceCodeAbsolutePathList.map((everySourceCodeAbsolutePath: string) => {
      const everySourceCodeRelativePath = everySourceCodeAbsolutePath.replace(clinetCompilerConfig.source, "");
      return [everySourceCodeRelativePath, everySourceCodeAbsolutePath];
    }));
    console.log("临时水合化脚本的生成目录", tempHydrationDirectory);
    console.log("需要进行水合化处理的页面", sourceCodeRelativePathList);
  };

};


IOCContainer.bind(WapperClientToHydrationService).toSelf().inRequestScope();