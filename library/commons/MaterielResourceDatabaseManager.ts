import path from "path";
import type { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/library/commons/IOCContainer";
import { CompilationConfigManager } from "@/library/commons/CompilationConfigManager";

@injectable()
export class MaterielResourceDatabaseManager {

  private hydrationCompileDatabase: Low<{}>;

  private dehydrationCompileDatabase: Low<{}>;

  constructor(
    @inject(CompilationConfigManager) private readonly $CompilationConfigManager: CompilationConfigManager
  ) { };

  public async initialize() {
    try {
      const { assetsDirectoryPath } = await this.$CompilationConfigManager.getRuntimeConfig();
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

IOCContainer.bind(MaterielResourceDatabaseManager).toSelf().inSingletonScope();