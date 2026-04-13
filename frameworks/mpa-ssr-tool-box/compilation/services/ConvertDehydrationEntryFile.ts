import fs from "fs";
import path from "path";
import memfs from "memfs";
import { ufs } from "unionfs";
import { promisify } from "util";
import { v4 as uuid } from "uuid";
import { fromPairs } from "lodash";
import { injectable } from "inversify";

import { IOCContainer } from "@/frameworks/mpa-ssr-tool-box/compilation/cores/IOCContainer";

import type { Compiler } from "webpack";
import type { IUnionFs, IFS } from "unionfs";
import type { EntryObject } from "webpack";

/**
 * 改造注水资源的入口文件,可以在这个模块中添加架构特性
 * 实现细节如下:
 * 基于虚拟文件系统和原生文件系统拼接而成的联合文件系统
 * 用于替换webpack的文件系统接口,为了兼容架构需求,满足临时文件的 生成 修改 与 注入 在编译阶段实现临时文件的无痕管理
 * 详情请参考webpack官方的API文档(官方的叫法是 自定义文件系统(Custom File Systems))
 * @docs https://webpack.docschina.org/api/node#custom-file-systems
 * **/
@injectable()
export class ConvertDehydrationEntryFile {

  private virtualDirectoryPath = path.resolve(process.cwd(), `./${uuid()}/__virtual__/dehydration/`);

  private custmerFileSystem: IUnionFs = ufs.use((memfs.fs as unknown as IFS)).use(fs);

  private webpackEntryPoints: EntryObject = {};

  private async getDehydrationEntryTemplateContent(): Promise<string> {
    return await promisify(fs.readFile)(path.resolve(__dirname, "../templates/dehydration.entry.template"), "utf-8");
  };

  /**
   * 初始化阶段
   * 在虚拟文件系统中对每个原始文件进行架构包装生成新的入口文件
   * 并生成webpack可以识别的entry-points对象
   * **/
  public async initialize(materielPairs: [string, string][]) {
    const hydrationTemplateFileContent = await this.getDehydrationEntryTemplateContent();
    /** 基于alias生成新的入口文件内容 **/
    const virtualFileVolumePairs = await Promise.all(materielPairs.map(async ([alias, resource]) => {
      const virtualEntryModuleName = `./${alias}.entry.tsx`;
      const virtualEntryModuleContent = hydrationTemplateFileContent.replace("$$sourceCodeFilePath$$", resource);
      return [virtualEntryModuleName, virtualEntryModuleContent];
    }));
    /** 在内存中写入这些新入口文件的内容 **/
    memfs.vol.fromJSON(fromPairs(virtualFileVolumePairs), this.virtualDirectoryPath);
    /** 生成详细的webpackEntryPoints **/
    this.webpackEntryPoints = fromPairs(materielPairs.map(([alias]) => {
      return [alias, [
        "source-map-support/register",
        path.join(this.getVirtualDirectoryPath(), `./${alias}.entry.tsx`)
      ]];
    }));
  };

  /** 挂载到webpack的文件系统上 **/
  public mountWithWebpackCompiler(webpackCompiler: Compiler) {
    /** 改变webpack编译对象上使用的 文件系统 接口为 联合文件系统 **/
    webpackCompiler.inputFileSystem = this.custmerFileSystem;
  };

  public getVirtualDirectoryPath(): string {
    return this.virtualDirectoryPath;
  };

  public getWebpackEntryPoints(): EntryObject {
    return this.webpackEntryPoints;
  };

};


IOCContainer.bind(ConvertDehydrationEntryFile).toSelf().inRequestScope()