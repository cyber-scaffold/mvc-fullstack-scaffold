import path from "path";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/mpa-ssr-tool-box/runtime/cores/IOCContainer";
import { RuntimeConfigManager } from "@/frameworks/mpa-ssr-tool-box/runtime/commons/RuntimeConfigManager";

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

IOCContainer.bind(RuntimeMaterielResourceDatabaseManager).toSelf().inSingletonScope();