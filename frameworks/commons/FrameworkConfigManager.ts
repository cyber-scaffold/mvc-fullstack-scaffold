import vm from "vm";
import fs from "fs";
import path from "path";
import Module from "module";
import { merge } from "lodash";
import { promisify } from "util";
import pathExists from "path-exists";
import { injectable } from "inversify";

import { IOCContainer } from "@/frameworks/commons/IOCContainer";

@injectable()
export class FrameworkConfigManager {

  /** 应用层内置的默认配置 **/
  private defaultConfig: any = {
    /** 编译产物的目标地址 **/
    destnation: path.resolve(process.cwd(), "./dist/"),
    /** 静态资源相关的配置选项 **/
    resources: {
      source: path.resolve(process.cwd(), "./frameworks/resources/")
    },
    /** 服务端的编译选项 **/
    serverCompilerConfig: {
      source: path.resolve(process.cwd(), "./main/server/"),
    },
    /** 服务端渲染物料的详细制作信息 **/
    materiels: []
  };

  /** 项目根目录下的自定义配置 **/
  private custmerConfig: any = {
    materiels: []
  };

  /** 声明在$HOME目录下的配置文件路径 **/
  get custmerConfigPath() {
    return path.join(process.cwd(), "./.framework.js");
  };

  /**
   * 基于沙箱模式加载自定义配置
   * **/
  private async loadCustmerConfigWithSandbox() {
    const resourceFileCode = await promisify(fs.readFile)(this.custmerConfigPath, "utf-8");
    const requireProject: NodeJS.Require = Module.createRequire(path.resolve(process.cwd(), "./package.json"));
    const sandbox = {
      module: { exports: {} },
      exports: {},
      process: process,
      require: requireProject,
      __dirname: path.dirname(this.custmerConfigPath),
      __filename: this.custmerConfigPath,
      console
    };
    vm.createContext(sandbox);
    vm.runInContext(resourceFileCode, sandbox, { filename: this.custmerConfigPath });
    return (sandbox.module.exports as any);
  };

  /** 初始化并加载配置到运行时 **/
  public async initialize() {
    if (await pathExists(this.custmerConfigPath)) {
      this.custmerConfig = await this.loadCustmerConfigWithSandbox();
    };
  };

  /** 获取最终组合之后的运行时配置 **/
  public getRuntimeConfig() {
    const composeConfig = merge({}, this.defaultConfig, this.custmerConfig);
    return composeConfig;
  };

};

IOCContainer.bind(FrameworkConfigManager).toSelf().inSingletonScope();