import path from "path";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/mpa-ssr-tool-box/compilation/cores/IOCContainer";
import { CompilationConfigManager } from "@/frameworks/mpa-ssr-tool-box/compilation/commons/CompilationConfigManager";

import type { SummaryDatabaseDictionaryType, ResourceDatabaseDictionaryType } from "@/frameworks/mpa-ssr-tool-box/public/DatabaseManager";

@injectable()
export class CompilationMaterielResourceDatabaseManager {

  private summaryDatabase: Low<SummaryDatabaseDictionaryType>;

  private hydrationCompileDatabase: Low<ResourceDatabaseDictionaryType>;

  private dehydrationCompileDatabase: Low<ResourceDatabaseDictionaryType>;

  constructor (
    @inject(CompilationConfigManager) private readonly $CompilationConfigManager: CompilationConfigManager
  ) { };

  public async initialize() {
    try {
      const { assetsDirectoryPath } = await this.$CompilationConfigManager.getRuntimeConfig();
      this.summaryDatabase = new Low(new JSONFile(path.resolve(assetsDirectoryPath, "./summary.json")), {});
      this.hydrationCompileDatabase = new Low(new JSONFile(path.resolve(assetsDirectoryPath, "./hydration-compile.json")), {});
      this.dehydrationCompileDatabase = new Low(new JSONFile(path.resolve(assetsDirectoryPath, "./dehydration-compile.json")), {});
    } catch (error) {
      throw error;
    };
  };

  public getSummaryDatabase(): Low<SummaryDatabaseDictionaryType> {
    return this.summaryDatabase;
  };

  public getHydrationCompileDatabase(): Low<ResourceDatabaseDictionaryType> {
    return this.hydrationCompileDatabase;
  };

  public getDehydrationCompileDatabase(): Low<ResourceDatabaseDictionaryType> {
    return this.dehydrationCompileDatabase;
  };

};

IOCContainer.bind(CompilationMaterielResourceDatabaseManager).toSelf().inSingletonScope();