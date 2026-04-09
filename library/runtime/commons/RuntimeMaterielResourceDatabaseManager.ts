import path from "path";
import type { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/library/runtime/cores/IOCContainer";
import { RuntimeConfigManager } from "@/library/runtime/commons/RuntimeConfigManager";

@injectable()
export class RuntimeMaterielResourceDatabaseManager {

  private hydrationCompileDatabase: Low<{}>;

  private dehydrationCompileDatabase: Low<{}>;

  constructor (
    @inject(RuntimeConfigManager) private readonly $RuntimeConfigManager: RuntimeConfigManager
  ) { };

  public async initialize() {
    try {
      const { assetsDirectoryPath } = await this.$RuntimeConfigManager.getRuntimeConfig();
      this.hydrationCompileDatabase = await JSONFilePreset(path.resolve(assetsDirectoryPath, "./hydration-compile.json"), {});
      await this.hydrationCompileDatabase.write();
      this.dehydrationCompileDatabase = await JSONFilePreset(path.resolve(assetsDirectoryPath, "./dehydration-compile.json"), {});
      await this.dehydrationCompileDatabase.write();
    } catch (error) {
      throw error;
    };
  };

  public getHydrationCompileDatabase(): Low<{}> {
    return this.hydrationCompileDatabase;
  };

  public getDehydrationCompileDatabase(): Low<{}> {
    return this.dehydrationCompileDatabase;
  };

};

IOCContainer.bind(RuntimeMaterielResourceDatabaseManager).toSelf().inSingletonScope();