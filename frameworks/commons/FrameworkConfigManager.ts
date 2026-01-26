import vm from "vm";
import fs from "fs";
import path from "path";
import Module from "module";
import { promisify } from "util";
import pathExists from "path-exists";
import { injectable } from "inversify";

import { IOCContainer } from "@/frameworks/commons/IOCContainer";

@injectable()
export class FrameworkConfigManager {

  /**
   * 入口文件
   * **/
  private entryFile = path.resolve(process.cwd(), "./main/server/index.ts");

  /**
   * 提取Swagger文档的glob表达式
   * **/
  private extractSwaggerGlobExpression = path.resolve(process.cwd(), "./main/server/controllers/**/*.{ts,tsx,js,jsx}");

  /**
   * 项目根目录的路径
   * **/
  private projectDirectoryPath = process.cwd();

  /**
   * 编译产物的目标地址的文件夹名称
   * **/
  private assetsDirectoryName = "dist";

  /**
   * 计算后得到的编译资产输出目录
   * **/
  get assetsDirectoryPath() {
    return path.resolve(this.projectDirectoryPath, this.assetsDirectoryName);
  };

  /**
   * 静态资源的原始目录
   * **/
  get staticSourceDirectoryPath() {
    return path.resolve(this.projectDirectoryPath, "./frameworks/resources/");
  };

  /**
   * 静态资源的目标目录名称
   * **/
  private staticDestinationDirectoryName = "resources";

  /**
   * 静态资源的目标目录的路径
   * **/
  get staticDestinationDirectoryPath() {
    return path.resolve(this.assetsDirectoryPath, this.staticDestinationDirectoryName);
  };

  /**
   * 服务端渲染物料的详细制作信息
   * **/
  private materiels = [];

  /**
   * 声明在$HOME目录下的配置文件路径
   * **/
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
    if (!(await pathExists(this.custmerConfigPath))) {
      return false;
    };
    const custmerConfig = await this.loadCustmerConfigWithSandbox();
    if (custmerConfig.entryFile) {
      this.entryFile = custmerConfig.entryFile;
    };
    if (custmerConfig.projectDirectoryPath) {
      this.projectDirectoryPath = custmerConfig.projectDirectoryPath;
    };
    if (custmerConfig.assetsDirectoryName) {
      this.assetsDirectoryName = custmerConfig.assetsDirectoryName;
    };
    if (custmerConfig.extractSwaggerGlobExpression) {
      this.extractSwaggerGlobExpression = custmerConfig.extractSwaggerGlobExpression;
    };
    if (custmerConfig.staticDestinationDirectoryName) {
      this.staticDestinationDirectoryName = custmerConfig.staticDestinationDirectoryName;
    };
    if (custmerConfig.materiels) {
      this.materiels = custmerConfig.materiels;
    };
  };

  /** 获取最终组合之后的运行时配置 **/
  public getRuntimeConfig() {
    return {
      entryFile: this.entryFile,
      extractSwaggerGlobExpression: this.extractSwaggerGlobExpression,
      projectDirectoryPath: this.projectDirectoryPath,
      assetsDirectoryName: this.assetsDirectoryName,
      assetsDirectoryPath: this.assetsDirectoryPath,
      staticSourceDirectoryPath: this.staticSourceDirectoryPath,
      staticDestinationDirectoryName: this.staticDestinationDirectoryName,
      staticDestinationDirectoryPath: this.staticDestinationDirectoryPath,
      materiels: this.materiels
    };
  };

};

IOCContainer.bind(FrameworkConfigManager).toSelf().inSingletonScope();