import path from "path";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/library/compilation/cores/IOCContainer";
import { CompilationConfigManager } from "@/library/compilation/commons/CompilationConfigManager";


@injectable()
export class CompilationMaterielResourceDatabaseManager {

  private hydrationCompileDatabase: Low<{}>;

  private dehydrationCompileDatabase: Low<{}>;

  constructor (
    @inject(CompilationConfigManager) private readonly $CompilationConfigManager: CompilationConfigManager
  ) { };

  public async initialize() {
    try {
      const { assetsDirectoryPath } = await this.$CompilationConfigManager.getRuntimeConfig();
      this.hydrationCompileDatabase = new Low(new JSONFile(path.resolve(assetsDirectoryPath, "./hydration-compile.json")), {});
      this.dehydrationCompileDatabase = new Low(new JSONFile(path.resolve(assetsDirectoryPath, "./dehydration-compile.json")), {});
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

IOCContainer.bind(CompilationMaterielResourceDatabaseManager).toSelf().inSingletonScope();