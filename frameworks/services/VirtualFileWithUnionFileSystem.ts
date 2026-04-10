import fs from "fs";
import path from "path";
import memfs from "memfs";
import { ufs } from "unionfs";
import { promisify } from "util";
import { v4 as uuid } from "uuid";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/cores/IOCContainer";

import type { Compiler } from "webpack";
import type { IUnionFs, IFS } from "unionfs";

/**
 * 基于虚拟文件系统和原生文件系统拼接而成的联合文件系统
 * 用于替换webpack的文件系统接口,为了兼容架构需求,满足临时文件的 生成 修改 与 注入 在编译阶段实现临时文件的无痕管理
 * 详情请参考webpack官方的API文档(官方的叫法是 自定义文件系统(Custom File Systems))
 * @docs https://webpack.docschina.org/api/node#custom-file-systems
 * **/
@injectable()
export class VirtualFileWithUnionFileSystem {

  private virtualDirectoryPath = path.resolve(process.cwd(), `./__virtual__/${uuid()}/`);

  private custmerFileSystem: IUnionFs = ufs.use((memfs.fs as unknown as IFS)).use(fs);

  /**
   * 初始化阶段
   * 1. 挂载文件
   * 2. 修改文件系统接口
   * **/
  public async initialize(webpackCompiler: Compiler) {
    /** 在虚拟文件系统中生成一个空白的架构临时文件 **/
    memfs.vol.fromJSON({ "./frameworkEntry.js": "" }, this.virtualDirectoryPath);
    /** 改变webpack编译对象上使用的 文件系统 接口为 联合文件系统 **/
    webpackCompiler.inputFileSystem = this.custmerFileSystem;
  };

  /**
   * 生成架构入口文件的具体内容
   * 比如注入 架构函数 和 相关特性 或者在全局对象上挂载相关属性和方法
   * **/
  public async generateEntryFileContent(entryFileContent: string) {
    await promisify(memfs.fs.writeFile)(this.getEntryFileVirtualPath(), entryFileContent);
  };

  public getEntryFileVirtualPath() {
    return path.join(this.virtualDirectoryPath, "./frameworkEntry.js");
  };

};


IOCContainer.bind(VirtualFileWithUnionFileSystem).toSelf().inRequestScope();