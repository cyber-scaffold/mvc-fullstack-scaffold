import path from "path";
import { merge } from "lodash";
import { readFile } from "jsonfile";
import pathExists from "path-exists";
import { injectable } from "inversify";

import { IOCContainer } from "@/main/commons/Application/IOCContainer";

@injectable()
export class ApplicationConfigManager {

  /** 应用层内置的默认配置 **/
  private defaultConfig: any = {
    server: {
      port: 8190
    }
  };

  /** $HOME目录下的配置 **/
  private custmerConfig: any = {};

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
  public getRuntimeConfig() {
    const composeConfig = merge({}, this.defaultConfig, this.custmerConfig);
    return composeConfig;
  };

};

IOCContainer.bind(ApplicationConfigManager).toSelf().inSingletonScope();