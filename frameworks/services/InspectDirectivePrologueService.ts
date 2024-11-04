import fs from "fs";
import path from "path";
import glob from "glob";
import { uniq } from "lodash";
import { promisify } from "util";
import babelTraverse from "@babel/traverse";
import { injectable, inject } from "inversify";
import { parse as babelParser } from "@babel/core";

import { IOCContainer } from "@/frameworks/commons/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";

export type DirectivePrologueLegalityCheckType = {
  type: "client-assets-filename",
  outputFilename: string
};

export type CompilerFileDetailedType = {
  type: "client-assets-filename",
  source: string,
  outputFilename: string,
};

export type WebpackCompilerFileType = {
  entry: string,
  output: string,
};

/**
 * 基于自定义的序言指令对需要客户端渲染的文件进行标记
 * 例如在文件头部含有 "client-assets-filename=detail";
 * 标记有这个 序言指令 的文件就会被输出为 dist/www/detail.js 这个文件
 * **/
@injectable()
export class InspectDirectivePrologueService {

  /**
   * 待编译的文件清单
   * **/
  private compilerFileList: CompilerFileDetailedType[];

  constructor(
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager
  ) { };

  /**
   * 序言解析器在解析序言表达式的同时也会检查序言的语法的合法性
   * 表达式的类型必须为 client-assets-filename
   * 且filename(文件名)必须存在
   * 满足这两种情况的时候序言就是合法的
   * 否则会返回false
   * **/
  static DirectivePrologueParser(directivePrologueExpression: string): DirectivePrologueLegalityCheckType {
    const [expressionType, outputFilename] = directivePrologueExpression.split("=");
    if (outputFilename.match(/\./)) {
      throw new Error(`${outputFilename} 中 client-assets-filename 的标识不能包含特殊字符 “.”`);
    };
    if (expressionType === "client-assets-filename" && outputFilename) {
      return { type: expressionType, outputFilename };
    };
    throw new Error("序言表达式错误!!!");
  };

  /**
   * 提取包含序言指令的源代码文件
   * 向后续的处理程序输出编译清单
   * **/
  public async extractDirectivePrologueSourceFile(): Promise<void> {
    const { clinetCompilerConfig } = this.$FrameworkConfigManager.getRuntimeConfig();
    /** 匹配所有的ts,tsx,js,jsx后缀的文件 **/
    const matchPattern = path.join(clinetCompilerConfig.source, "./**/*{.ts,.tsx,js,jsx}");
    const matchSourceFile = await glob(matchPattern);
    /** 根据序言整理出编译清单 **/
    const directivePrologueLegalityCheckResult = await Promise.all(matchSourceFile.map(async (everySourceFilePath) => {
      const sourceCodeContent = await promisify(fs.readFile)(everySourceFilePath, "utf-8");
      /** 获取源代码的AST **/
      const sourceCodeAST = babelParser(sourceCodeContent, { filename: everySourceFilePath });
      /** 分析AST中的序言指令 **/
      const directivePrologue = await new Promise((resolve) => {
        let condition = false;
        babelTraverse(sourceCodeAST, {
          Program(path) {
            const directives = path.node.directives;
            directives.forEach(directive => {
              const directiveValue = directive.value.value;
              if (!directiveValue.match("client-assets-filename")) {
                return false;
              };
              condition = directiveValue
            });
          }
        });
        resolve(condition);
      });
      /** 排除其他的序言 **/
      if (!directivePrologue) {
        return false;
      };
      /** client-assets-filename 序言不合法 **/
      const directiveParserResult = InspectDirectivePrologueService.DirectivePrologueParser((directivePrologue as string));
      /** 返回详细的编译信息 **/
      return { ...directiveParserResult, source: everySourceFilePath };
    }));
    const filterDirectivePrologueLegalityCheckResult = (directivePrologueLegalityCheckResult.filter(Boolean) as CompilerFileDetailedType[]);
    const originFilenameArray = filterDirectivePrologueLegalityCheckResult.map(({ outputFilename }) => path.basename(outputFilename));
    const uniqFilenameArray = uniq(originFilenameArray);
    if (originFilenameArray.length !== uniqFilenameArray.length) {
      throw new Error(`client-assets-filename 标识符 出现重复项 ${JSON.stringify(originFilenameArray)}`);
    };
    this.compilerFileList = filterDirectivePrologueLegalityCheckResult;
  };

  /**
   * 获取客户端文件的编译清单
   * 这里只返回输出路径和源文件
   * **/
  public getCompilerFileList(): WebpackCompilerFileType[] {
    return this.compilerFileList.map(({ source, outputFilename }) => ({ entry: source, output: outputFilename }));
  };

};


IOCContainer.bind(InspectDirectivePrologueService).toSelf().inRequestScope();

