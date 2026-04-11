import path from "path";
import { injectable } from "inversify";

import { IOCContainer } from "@/library/compilation/cores/IOCContainer";

export interface IMaterielInfo {
  alias: string,
  hydration: boolean
  dehydrated: boolean
  source: string
};

export interface ICompilationConfig {
  projectDirectoryPath: string
  assetsDirectoryPath: string
  fileResourceDirectoryName: string
  fileResourceDirectoryPath: string
  hydrationResourceDirectoryPath: string
  dehydrationResourceDirectoryPath: string
  materiels: IMaterielInfo[]
};

export interface ICustmerCompilationConfig {
  projectDirectoryPath?: string
  assetsDirectoryName?: string
  fileResourceDirectoryName?: string
  hydrationResourceDirectoryName?: string
  dehydrationResourceDirectoryName?: string
  materiels?: IMaterielInfo[]
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
    return path.resolve(this.getAssetsDirectoryPath(), this.hydrationResourceDirectoryName);
  };

  /**
   * 物料的编译信息
   * **/
  private materiels: IMaterielInfo[];

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
    if (inputCustmerConfig.materiels) {
      this.materiels = inputCustmerConfig.materiels;
    };
  };

  /** 获取最终组合之后的运行时配置 **/
  public getRuntimeConfig(): ICompilationConfig {
    return {
      projectDirectoryPath: this.projectDirectoryPath,
      assetsDirectoryPath: this.getAssetsDirectoryPath(),
      fileResourceDirectoryName: this.fileResourceDirectoryName,
      fileResourceDirectoryPath: this.getFileResourceDirectoryPath(),
      hydrationResourceDirectoryPath: this.getHydrationResourceDirectoryPath(),
      dehydrationResourceDirectoryPath: this.getDehydrationResourceDirectoryPath(),
      materiels: this.materiels
    };
  };

};

IOCContainer.bind(CompilationConfigManager).toSelf().inSingletonScope();