import path from "path";
import { injectable } from "inversify";

import { IOCContainer } from "@/library/runtime/cores/IOCContainer";

export interface IRuntimeConfig {
  projectDirectoryPath: string,
  assetsDirectoryPath: string
  hydrationResourceDirectoryPath: string
  dehydrationResourceDirectoryPath: string
};

export interface ICustmerRuntimeConfig {
  projectDirectoryPath?: string,
  assetsDirectoryName?: string
  hydrationResourceDirectoryName?: string
  dehydrationResourceDirectoryName?: string
};

/** 
 * 运行时的服务提取物料配置的管理器
 * 主要是通过修改projectDirectoryPath 和 assetsDirectoryName来和编译配置保持一致
 * 方便后续的服务在获取物料配置的时候可以获取到完整的路径
 * **/
@injectable()
export class RuntimeConfigManager {

  /** 项目的根目录 **/
  private projectDirectoryPath = path.resolve(path.dirname(process.argv[1]), "../");

  /** 物料资产的目录 **/
  private assetsDirectoryName = "dist";

  /** 物料资产输出的目录(根据 项目的根目录 和 物料资产的目录 计算得到) **/
  private getAssetsDirectoryPath() {
    return path.resolve(this.projectDirectoryPath, this.assetsDirectoryName);
  };

  /** 脱水资源的输出位置对应的文件夹名称 **/
  private dehydrationResourceDirectoryName = "dehydration";

  /** 脱水资源的输出位置(服务端ssr渲染函数)(根据 物料资产的目录 和 对应文件夹名称 计算得到) **/
  private getDehydrationResourceDirectoryPath() {
    return path.resolve(this.getAssetsDirectoryPath(), this.dehydrationResourceDirectoryName);
  };

  /** 注水资源的输出位置对应的文件夹名称 **/
  private hydrationResourceDirectoryName = "hydration";

  /** 注水资源的输出位置(前端javascript和css)(根据 物料资产的目录 和 对应文件夹名称 计算得到) **/
  private getHydrationResourceDirectoryPath() {
    return path.resolve(this.getAssetsDirectoryPath(), this.hydrationResourceDirectoryName)
  };

  /** 初始化配置并计算出剩余的属性 **/
  public async initialize(inputCustmerConfig: ICustmerRuntimeConfig) {
    if (!inputCustmerConfig) {
      return false;
    };
    if (inputCustmerConfig.projectDirectoryPath) {
      this.projectDirectoryPath = inputCustmerConfig.projectDirectoryPath;
    };
    if (inputCustmerConfig.assetsDirectoryName) {
      this.assetsDirectoryName = inputCustmerConfig.assetsDirectoryName;
    };
    if (inputCustmerConfig.hydrationResourceDirectoryName) {
      this.hydrationResourceDirectoryName = inputCustmerConfig.hydrationResourceDirectoryName;
    };
    if (inputCustmerConfig.dehydrationResourceDirectoryName) {
      this.dehydrationResourceDirectoryName = inputCustmerConfig.dehydrationResourceDirectoryName;
    };
  };

  /** 获取最终组合之后的运行时配置 **/
  public getRuntimeConfig(): IRuntimeConfig {
    return {
      projectDirectoryPath: this.projectDirectoryPath,
      assetsDirectoryPath: this.getAssetsDirectoryPath(),
      hydrationResourceDirectoryPath: this.getHydrationResourceDirectoryPath(),
      dehydrationResourceDirectoryPath: this.getDehydrationResourceDirectoryPath()
    };
  };

};

IOCContainer.bind(RuntimeConfigManager).toSelf().inSingletonScope();