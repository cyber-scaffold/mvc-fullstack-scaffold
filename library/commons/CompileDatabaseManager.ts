import path from "path";
import type { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/library/commons/IOCContainer";
import { FrameworkConfigManager } from "@/library/commons/FrameworkConfigManager";

@injectable()
export class CompileDatabaseManager {

  private compileDatabase: Low<{}>;

  constructor(
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager
  ) { };

  public async initialize() {
    try {
      const { assetsDirectoryPath } = await this.$FrameworkConfigManager.getRuntimeConfig();
      this.compileDatabase = await JSONFilePreset(path.resolve(assetsDirectoryPath, "./compile.json"), {});
      await this.compileDatabase.write();
    } catch (error) {
      throw error;
    };
  };

  public getCompileDatabase(): Low<{}> {
    return this.compileDatabase;
  };

};

IOCContainer.bind(CompileDatabaseManager).toSelf().inSingletonScope();