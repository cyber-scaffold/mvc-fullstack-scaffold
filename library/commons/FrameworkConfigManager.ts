import path from "path";
import { merge } from "lodash";
import { readFile } from "jsonfile";
import pathExists from "path-exists";
import { injectable } from "inversify";

import { IOCContainer } from "@/library/commons/IOCContainer";

export interface IFrameworkConfig {
  assetsDirectoryPath: string
  tempHydrationDirectoryPath: string
  hydrationResourceDirectoryPath: string
  dehydrationResourceDirectoryPath: string
};

export interface ICustmerFrameworkConfig {
  assetsDirectoryPath?: string
  tempHydrationDirectoryPath?: string
  hydrationResourceDirectoryPath?: string
  dehydrationResourceDirectoryPath?: string
};

@injectable()
export class FrameworkConfigManager {

  /** 应用层内置的默认配置 **/
  private defaultConfig: IFrameworkConfig = {
    /** 编译资产的输出目录 **/
    assetsDirectoryPath: path.resolve(process.cwd(), "./dist/"),
    /** 临时水合化脚本的生成目录 **/
    tempHydrationDirectoryPath: path.resolve(process.cwd(), "./dist/.hydration/"),
    /** 水合化渲染资源的输出位置(前端javascript和css) **/
    hydrationResourceDirectoryPath: path.resolve(process.cwd(), "./dist/hydration/"),
    /** 脱水化渲染资源的输出位置(服务端ssr渲染函数) **/
    dehydrationResourceDirectoryPath: path.resolve(process.cwd(), "./dist/dehydration/"),

  };

  /** $HOME目录下的配置 **/
  private custmerConfig: ICustmerFrameworkConfig = {};

  /** 声明在$HOME目录下的配置文件路径 **/
  get custmerConfigPath() {
    return path.join(process.cwd(), "./config.json");
  };

  /** 初始化并加载配置到运行时 **/
  public async initialize() {
    if (await pathExists(this.custmerConfigPath)) {
      this.custmerConfig = await readFile(this.custmerConfigPath);
    };
  };

  /** 获取最终组合之后的运行时配置 **/
  public getRuntimeConfig(): IFrameworkConfig {
    const composeConfig = merge({}, this.defaultConfig, this.custmerConfig);
    return composeConfig;
  };

};

IOCContainer.bind(FrameworkConfigManager).toSelf().inSingletonScope();