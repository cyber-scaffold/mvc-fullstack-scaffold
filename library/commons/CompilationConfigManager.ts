import path from "path";
import { injectable } from "inversify";

import { IOCContainer } from "@/library/cores/IOCContainer";

export interface ICompilationConfig {
  projectDirectoryPath: string,
  assetsDirectoryPath: string
  hydrationResourceDirectoryPath: string
  dehydrationResourceDirectoryPath: string
};

export interface ICustmerCompilationConfig {
  projectDirectoryPath?: string,
  assetsDirectoryName?: string
  hydrationResourceDirectoryName?: string
  dehydrationResourceDirectoryName?: string
  standardizationHydrationTempDirectoryName?: string
};

/** 
 * 制作物料阶段的框架配置
 * **/
@injectable()
export class CompilationConfigManager {

  /** 项目的根目录 **/
  private projectDirectoryPath = process.cwd();

  /** 物料资产的目录 **/
  private assetsDirectoryName = "dist";

  /** 物料资产输出的目录(根据 项目的根目录 和 物料资产的目录 计算得到) **/
  private assetsDirectoryPath = path.resolve(this.projectDirectoryPath, this.assetsDirectoryName);

  /** 脱水资源的输出位置对应的文件夹名称 **/
  private dehydrationResourceDirectoryName = "dehydration";

  /** 脱水资源的输出位置(服务端ssr渲染函数)(根据 物料资产的目录 和 对应文件夹名称 计算得到) **/
  private dehydrationResourceDirectoryPath = path.resolve(this.assetsDirectoryPath, this.dehydrationResourceDirectoryName);

  /** 注水资源的输出位置对应的文件夹名称 **/
  private hydrationResourceDirectoryName = "hydration";

  /** 注水资源的输出位置(前端javascript和css)(根据 物料资产的目录 和 对应文件夹名称 计算得到) **/
  private hydrationResourceDirectoryPath = path.resolve(this.assetsDirectoryPath, this.hydrationResourceDirectoryName);

  /** 基于用户的配置合并覆盖掉原来的属性然后重新计算一遍 **/
  public async initialize(inputCustmerConfig: ICustmerCompilationConfig) {
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
  public getRuntimeConfig(): ICompilationConfig {
    return {
      projectDirectoryPath: this.projectDirectoryPath,
      assetsDirectoryPath: this.assetsDirectoryPath,
      hydrationResourceDirectoryPath: this.hydrationResourceDirectoryPath,
      dehydrationResourceDirectoryPath: this.dehydrationResourceDirectoryPath
    };
  };

};

IOCContainer.bind(CompilationConfigManager).toSelf().inSingletonScope();