import path from "path";
import { injectable } from "inversify";

import { IOCContainer } from "@/frameworks/mpa-ssr-tool-box/compilation/cores/IOCContainer";
import { materielsConfigTransformer } from "@/frameworks/mpa-ssr-tool-box/compilation/utils/materielsConfigTransformer";

import type { MaterielInfoByAliasDictionaryType } from "@/frameworks/mpa-ssr-tool-box/compilation/utils/materielsConfigTransformer";

export type MaterielRenderType = {
  hydrate: boolean
  dehydrate: boolean
};

export type MaterielDetailInfoType = {
  alias: string
  source: string
};

export type MaterielCompilationInfoType = MaterielRenderType & MaterielDetailInfoType;

export interface CompilationConfigType {
  projectDirectoryPath: string
  assetsDirectoryPath: string
  fileResourceDirectoryName: string
  fileResourceDirectoryPath: string
  hydrationResourceDirectoryName: string
  hydrationResourceDirectoryPath: string
  dehydrationResourceDirectoryName: string
  dehydrationResourceDirectoryPath: string
  dehydrateDictionary: MaterielInfoByAliasDictionaryType
  hydrateDictionary: MaterielInfoByAliasDictionaryType
  materielArrayList: MaterielCompilationInfoType[]
};

export interface CustmerInputCompilationConfigType {
  projectDirectoryPath?: string
  assetsDirectoryName?: string
  fileResourceDirectoryName?: string
  hydrationResourceDirectoryName?: string
  dehydrationResourceDirectoryName?: string
  materiels?: MaterielCompilationInfoType[]
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
   * 数组形式的物料清单信息
   * **/
  private materielArrayList: MaterielCompilationInfoType[];

  /**
   * 需要编译的注水物料的字典
   * **/
  private hydrateDictionary: MaterielInfoByAliasDictionaryType;

  /**
   * 需要编译的脱水物料的字典
   * **/
  private dehydrateDictionary: MaterielInfoByAliasDictionaryType;


  /** 基于用户的配置合并覆盖掉原来的属性然后重新计算一遍 **/
  public async initialize(inputCustmerConfig: CustmerInputCompilationConfigType) {
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
      const { hydrate, dehydrate } = materielsConfigTransformer(inputCustmerConfig.materiels);
      this.dehydrateDictionary = dehydrate;
      this.hydrateDictionary = hydrate;
      this.materielArrayList = inputCustmerConfig.materiels;
    };
  };

  /** 获取最终组合之后的运行时配置 **/
  public getRuntimeConfig(): CompilationConfigType {
    return {
      projectDirectoryPath: this.projectDirectoryPath,
      assetsDirectoryPath: this.getAssetsDirectoryPath(),
      fileResourceDirectoryName: this.fileResourceDirectoryName,
      fileResourceDirectoryPath: this.getFileResourceDirectoryPath(),
      hydrationResourceDirectoryName: this.hydrationResourceDirectoryName,
      hydrationResourceDirectoryPath: this.getHydrationResourceDirectoryPath(),
      dehydrationResourceDirectoryName: this.dehydrationResourceDirectoryName,
      dehydrationResourceDirectoryPath: this.getDehydrationResourceDirectoryPath(),
      dehydrateDictionary: this.dehydrateDictionary,
      hydrateDictionary: this.hydrateDictionary,
      materielArrayList: this.materielArrayList
    };
  };

};

IOCContainer.bind(CompilationConfigManager).toSelf().inSingletonScope();