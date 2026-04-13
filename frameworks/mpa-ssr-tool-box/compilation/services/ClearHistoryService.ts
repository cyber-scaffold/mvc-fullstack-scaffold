import fs from "fs";
import path from "path";
import { promisify } from "util";
import pathExists from "path-exists";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/mpa-ssr-tool-box/compilation/cores/IOCContainer";
import { CompilationConfigManager } from "@/frameworks/mpa-ssr-tool-box/compilation/commons/CompilationConfigManager";
import { CompilationMaterielResourceDatabaseManager } from "@/frameworks/mpa-ssr-tool-box/compilation/commons/CompilationMaterielResourceDatabaseManager";

import type { CompileAssetsDictionaryType } from "@/frameworks/mpa-ssr-tool-box/public/filterWebpackStats";

/**
 * 在webpack的watch模式下清理掉旧的编译产物
 * **/
@injectable()
export class ClearHistoryService {

  constructor (
    @inject(CompilationMaterielResourceDatabaseManager) private readonly $CompilationMaterielResourceDatabaseManager: CompilationMaterielResourceDatabaseManager,
    @inject(CompilationConfigManager) private readonly $CompilationConfigManager: CompilationConfigManager
  ) { };

  /** 获取文件路径 **/
  private async getFileRealPathWithContext(type, filename: string) {
    const {
      hydrationResourceDirectoryPath,
      dehydrationResourceDirectoryPath
    } = await this.$CompilationConfigManager.getRuntimeConfig();
    if (type === "hydration") {
      return path.resolve(hydrationResourceDirectoryPath, filename);
    };
    if (type === "dehydration") {
      return path.resolve(dehydrationResourceDirectoryPath, filename);
    };
    throw new Error(`
      ${filename} unknow Resource Type Do You Mean "hydration" or "dehydration" or file not exist
    `);
  };

  /** 让新的资源清单和资源管理器中的清单进行比较 **/
  async diff(alias: string, type: "hydration" | "dehydration", latestAssetsFileList: CompileAssetsDictionaryType) {
    if (type === "hydration") {
      const database = this.$CompilationMaterielResourceDatabaseManager.getHydrationCompileDatabase();
      await database.read();
      const legacyAssetsFileList: CompileAssetsDictionaryType = database.data[alias];

    };
  };

  /** 清理遗留文件 **/
  public async execute(type: "hydration" | "dehydration", resources: CompileAssetsDictionaryType) {
    if (resources.javascript instanceof Array) {
      await Promise.all(resources.javascript.map(async (everyFileName) => {
        const javaScriptRealFilePath = await this.getFileRealPathWithContext(type, everyFileName);
        if (await pathExists(javaScriptRealFilePath)) {
          await promisify(fs.unlink)(javaScriptRealFilePath);
        };
        const javaScriptMapRealFilePath = await this.getFileRealPathWithContext(type, `${everyFileName}.map`);
        if (await pathExists(javaScriptMapRealFilePath)) {
          await promisify(fs.unlink)(javaScriptMapRealFilePath);
        };
      }));
    };
    if (resources.stylesheet instanceof Array) {
      await Promise.all(resources.stylesheet.map(async (everyFileName) => {
        const styleSheetRealFilePath = await this.getFileRealPathWithContext(type, everyFileName);
        if (await pathExists(styleSheetRealFilePath)) {
          await promisify(fs.unlink)(styleSheetRealFilePath);
        };
        const styleSheetMapRealFilePath = await this.getFileRealPathWithContext(type, `${everyFileName}.map`);
        if (await pathExists(styleSheetMapRealFilePath)) {
          await promisify(fs.unlink)(styleSheetMapRealFilePath);
        };
      }));
    };
    if (resources.statics instanceof Array) {
      await Promise.all(resources.statics.map(async (everyFileName) => {
        const realFilePath = await this.getFileRealPathWithContext(type, everyFileName);
        if (!(await pathExists(realFilePath))) {
          return false;
        };
        await promisify(fs.unlink)(realFilePath);
      }));
    };
  };

};


IOCContainer.bind(ClearHistoryService).toSelf().inRequestScope();