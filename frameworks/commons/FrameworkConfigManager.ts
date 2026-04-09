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
  private assetsDirectoryPath = path.resolve(this.projectDirectoryPath, this.assetsDirectoryName);

  /**
   * 项目中静态资源的原始目录
   * **/
  private staticResourceDirectorySourcePath = path.resolve(this.projectDirectoryPath, "./main/server/statics/");

  /**
   * 项目中静态资源的目标目录
   * **/
  private staticResourceDirectoryDestinationPath = path.resolve(this.assetsDirectoryPath, "./statics/");

  /**
   * 扫描Swagger文档时使用的glob表达式默认扫描controllers文件夹下的内容
   * **/
  private extractSwaggerGlobExpression = path.resolve(process.cwd(), "./main/server/controllers/**/*.{ts,tsx,js,jsx}");

  /**
   * Swagger静态资源的原始目录的路径
   * **/
  private swaggerResourceDirectorySourcePath = path.resolve(path.dirname(__filename), "../swagger/");

  /**
   * Swagger静态资源的目标目录的路径
   * **/
  private swaggerResourceDirectoryDestinationPath = path.resolve(this.assetsDirectoryPath, "./swagger/");

  /**
   * 服务端渲染物料的详细制作信息
   * **/
  private materiels = [];

  /**
   * 项目目录下的配置文件路径用于覆盖框架中的默认值
   * **/
  private custmerConfigPath = path.join(process.cwd(), "./.framework.js");

  /**
   * 基于沙箱模式加载项目的自定义配置文件
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
    if (custmerConfig.staticResourceDirectorySourcePath) {
      this.staticResourceDirectorySourcePath = custmerConfig.staticResourceDirectorySourcePath;
    };
    if (custmerConfig.staticResourceDirectoryDestinationPath) {
      this.staticResourceDirectoryDestinationPath = custmerConfig.staticResourceDirectoryDestinationPath
    };
    if (custmerConfig.extractSwaggerGlobExpression) {
      this.extractSwaggerGlobExpression = custmerConfig.extractSwaggerGlobExpression;
    };
    if (custmerConfig.swaggerResourceDirectorySourcePath) {
      this.swaggerResourceDirectorySourcePath = custmerConfig.swaggerResourceDirectorySourcePath;
    };
    if (custmerConfig.swaggerResourceDirectoryDestinationPath) {
      this.swaggerResourceDirectoryDestinationPath = custmerConfig.swaggerResourceDirectoryDestinationPath;
    };
    if (custmerConfig.materiels) {
      this.materiels = custmerConfig.materiels;
    };
  };

  /** 获取最终组合之后的运行时配置 **/
  public getRuntimeConfig() {
    return {
      entryFile: this.entryFile,
      projectDirectoryPath: this.projectDirectoryPath,
      assetsDirectoryName: this.assetsDirectoryName,
      assetsDirectoryPath: this.assetsDirectoryPath,
      staticResourceDirectorySourcePath: this.staticResourceDirectorySourcePath,
      staticResourceDirectoryDestinationPath: this.staticResourceDirectoryDestinationPath,
      extractSwaggerGlobExpression: this.extractSwaggerGlobExpression,
      swaggerResourceDirectorySourcePath: this.swaggerResourceDirectorySourcePath,
      swaggerResourceDirectoryDestinationPath: this.swaggerResourceDirectoryDestinationPath,
      materiels: this.materiels
    };
  };

};

IOCContainer.bind(FrameworkConfigManager).toSelf().inSingletonScope();