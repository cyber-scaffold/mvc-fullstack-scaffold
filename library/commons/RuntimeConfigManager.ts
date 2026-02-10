import path from "path";
import { injectable } from "inversify";

import { IOCContainer } from "@/library/commons/IOCContainer";

export interface IRuntimeConfig {
  projectDirectoryPath: string,
  assetsDirectoryPath: string
  hydrationResourceDirectoryPath: string
  dehydrationResourceDirectoryPath: string
  standardizationHydrationTempDirectoryPath: string
};

export interface ICustmerRuntimeConfig {
  projectDirectoryPath?: string,
  assetsDirectoryName?: string
  hydrationResourceDirectoryName?: string
  dehydrationResourceDirectoryName?: string
  standardizationHydrationTempDirectoryName?: string
};

/** 
 * 运行时的服务提取物料配置的管理器
 * 主要是通过修改projectDirectoryPath 和 assetsDirectoryName来和编译配置保持一致
 * 方便后续的服务在获取物料配置的时候可以获取到完整的路径
 * **/
@injectable()
export class RuntimeConfigManager {

  /** 项目的根目录 **/
  private projectDirectoryPath = process.cwd();

  /** 物料资产的目录 **/
  private assetsDirectoryName = "dist";

  /** 文件输出的目录(根据 项目的根目录 计算得到) **/
  get assetsDirectoryPath() {
    return path.resolve(this.projectDirectoryPath, this.assetsDirectoryName);
  };

  private hydrationResourceDirectoryName = "hydration";

  /** 注水资源的输出位置(前端javascript和css)(根据 文件输出的目录 计算得到) **/
  get hydrationResourceDirectoryPath() {
    return path.resolve(this.assetsDirectoryPath, this.hydrationResourceDirectoryName);
  };

  private dehydrationResourceDirectoryName = "dehydration";

  /** 脱水资源的输出位置(服务端ssr渲染函数)(根据 文件输出的目录 计算得到) **/
  get dehydrationResourceDirectoryPath() {
    return path.resolve(this.assetsDirectoryPath, this.dehydrationResourceDirectoryName);
  };

  /** 标准化注水文件的输出目录(对原文件进行wapper处理后的文件) **/
  private standardizationHydrationTempDirectoryName = ".hydration";

  /** 标准化注水资源的临时生成目录(根据 文件输出的目录 计算得到) **/
  get standardizationHydrationTempDirectoryPath() {
    return path.resolve(this.assetsDirectoryPath, this.standardizationHydrationTempDirectoryName);
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
    if (inputCustmerConfig.standardizationHydrationTempDirectoryName) {
      this.standardizationHydrationTempDirectoryName = inputCustmerConfig.standardizationHydrationTempDirectoryName;
    };
  };

  /** 获取最终组合之后的运行时配置 **/
  public getRuntimeConfig(): IRuntimeConfig {
    return {
      projectDirectoryPath: this.projectDirectoryPath,
      assetsDirectoryPath: this.assetsDirectoryPath,
      hydrationResourceDirectoryPath: this.hydrationResourceDirectoryPath,
      dehydrationResourceDirectoryPath: this.dehydrationResourceDirectoryPath,
      standardizationHydrationTempDirectoryPath: this.standardizationHydrationTempDirectoryPath
    };
  };

};

IOCContainer.bind(RuntimeConfigManager).toSelf().inSingletonScope();