import path from "path";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/mpa-ssr-tool-box/runtime/cores/IOCContainer";
import { RuntimeConfigManager } from "@/frameworks/mpa-ssr-tool-box/runtime/commons/RuntimeConfigManager";

import type { SummaryDatabaseDictionaryType, ResourceDatabaseDictionaryType } from "@/frameworks/mpa-ssr-tool-box/public/DatabaseManager";

@injectable()
export class RuntimeMaterielResourceDatabaseManager {

  private summaryDatabase: Low<SummaryDatabaseDictionaryType>;

  private hydrationCompileDatabase: Low<ResourceDatabaseDictionaryType>;

  private dehydrationCompileDatabase: Low<ResourceDatabaseDictionaryType>;

  constructor (
    @inject(RuntimeConfigManager) private readonly $RuntimeConfigManager: RuntimeConfigManager
  ) { };

  public async initialize() {
    try {
      const { assetsDirectoryPath } = await this.$RuntimeConfigManager.getRuntimeConfig();
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

IOCContainer.bind(RuntimeMaterielResourceDatabaseManager).toSelf().inSingletonScope();