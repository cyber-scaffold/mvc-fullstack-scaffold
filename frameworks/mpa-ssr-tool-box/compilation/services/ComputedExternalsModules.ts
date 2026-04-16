import path from "path";
import { difference } from "lodash";
import { readFile } from "jsonfile";
import { injectable, inject } from "inversify";
// import nodeExternals from "webpack-node-externals";

import { IOCContainer } from "@/frameworks/mpa-ssr-tool-box/compilation/cores/IOCContainer";
import { CompilationConfigManager } from "@/frameworks/mpa-ssr-tool-box/compilation/commons/CompilationConfigManager";


@injectable()
export class ComputedExternalsModules {

  constructor (
    @inject(CompilationConfigManager) private readonly $CompilationConfigManager: CompilationConfigManager
  ) { };

  /**
   * 从项目的配置文件中获取到必须需要被打包的模块信息
   * 只所以要这么做是因为如果全部模块都被排除的话在引用.css这类文件的时候会被翻译成require("<filename>.css")就会导致样式表编译失败
   * 所以通常情况下 组件库 这类包含静态资源编译的依赖需要被打包
   * 所以需要在项目文件中手动指定一下,避免出现错误
   * 还有一个原因是nodeExternals这个模块不能满足需求
   *  **/
  public async getComputedExternalsPackageList(): Promise<string[]> {
    const { projectDirectoryPath, dehydrateIncludePackageList, dehydrateExcludePackageList } = this.$CompilationConfigManager.getRuntimeConfig();
    const { dependencies, devDependencies } = await readFile(path.join(projectDirectoryPath, "./package.json"));
    const externalsPackageNameList = [...Object.keys(dependencies), ...Object.keys(devDependencies)];
    const result = [...difference(externalsPackageNameList, dehydrateIncludePackageList), ...dehydrateExcludePackageList];
    return result;
  };

};

IOCContainer.bind(ComputedExternalsModules).toSelf().inRequestScope();