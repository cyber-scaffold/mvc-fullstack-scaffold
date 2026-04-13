import path from "path";
import { injectable } from "inversify";

import { IOCContainer } from "@/frameworks/mpa-ssr-tool-box/runtime/cores/IOCContainer";

export type RuntimeConfig = {
  projectDirectoryPath: string
  assetsDirectoryPath: string
  fileResourceDirectoryPath: string
  hydrationResourceDirectoryPath: string
  dehydrationResourceDirectoryPath: string
};

export type CustmerRuntimeConfigType = {
  projectDirectoryPath?: string
  assetsDirectoryName?: string
  fileResourceDirectoryName?: string
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
  private projectDirectoryPath = "";

  /** 物料资产的目录 **/
  private assetsDirectoryName = "dist";

  /** 物料资产输出的目录(根据 项目的根目录 和 物料资产的目录 计算得到) **/
  private getAssetsDirectoryPath() {
    return path.resolve(this.projectDirectoryPath, this.assetsDirectoryName);
  };

  /** 文件资源的输出位置对应的文件夹名称 **/
  private fileResourceDirectoryName = "resource";

  /** 文件资源的输出位置(服务端ssr渲染函数)(根据 物料资产的目录 和 对应文件夹名称 计算得到) **/
  private getFileResourceDirectoryPath() {
    return path.resolve(this.getAssetsDirectoryPath(), this.fileResourceDirectoryName);
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
  public async initialize(inputCustmerConfig: CustmerRuntimeConfigType) {
    if (!inputCustmerConfig) {
      return false;
    };
    if (inputCustmerConfig.projectDirectoryPath) {
      this.projectDirectoryPath = inputCustmerConfig.projectDirectoryPath;
    };
    if (inputCustmerConfig.assetsDirectoryName) {
      this.assetsDirectoryName = inputCustmerConfig.assetsDirectoryName;
    };
    if (inputCustmerConfig.fileResourceDirectoryName) {
      this.fileResourceDirectoryName = inputCustmerConfig.fileResourceDirectoryName;
    };
    if (inputCustmerConfig.hydrationResourceDirectoryName) {
      this.hydrationResourceDirectoryName = inputCustmerConfig.hydrationResourceDirectoryName;
    };
    if (inputCustmerConfig.dehydrationResourceDirectoryName) {
      this.dehydrationResourceDirectoryName = inputCustmerConfig.dehydrationResourceDirectoryName;
    };
  };

  /** 获取最终组合之后的运行时配置 **/
  public getRuntimeConfig(): RuntimeConfig {
    if (!Boolean(this.projectDirectoryPath)) {
      throw new Error("RuntimeConfigManager Not Initialize Please Call setAndInitializeRuntimeConfig({projectDirectoryPath:<you project absolute path>})")
    };
    return {
      projectDirectoryPath: this.projectDirectoryPath,
      assetsDirectoryPath: this.getAssetsDirectoryPath(),
      fileResourceDirectoryPath: this.getFileResourceDirectoryPath(),
      hydrationResourceDirectoryPath: this.getHydrationResourceDirectoryPath(),
      dehydrationResourceDirectoryPath: this.getDehydrationResourceDirectoryPath()
    };
  };

};

IOCContainer.bind(RuntimeConfigManager).toSelf().inSingletonScope();