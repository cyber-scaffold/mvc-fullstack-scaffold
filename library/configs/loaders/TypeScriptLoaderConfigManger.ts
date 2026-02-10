import path from "path";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/library/commons/IOCContainer";
import { RuntimeConfigManager } from "@/library/commons/RuntimeConfigManager";

@injectable()
export class TypeScriptLoaderConfigManger {

  constructor(
    @inject(RuntimeConfigManager) private readonly $RuntimeConfigManager: RuntimeConfigManager
  ) { };

  public async getHydrationSiderLoaderConfig() {
    const { projectDirectoryPath } = this.$RuntimeConfigManager.getRuntimeConfig();
    return [{
      test: /\.(ts|tsx)$/,
      exclude: /(node_modules)/,
      use: [{
        loader: "ts-loader",
        options: {
          configFile: path.resolve(projectDirectoryPath, "./tsconfig.json")
        }
      }]
    }];
  };

  public async getDehydrationSiderLoaderConfig() {
    const { projectDirectoryPath } = this.$RuntimeConfigManager.getRuntimeConfig();
    return [{
      test: /\.(ts|tsx)$/,
      exclude: /(node_modules)/,
      use: [{
        loader: "ts-loader",
        options: {
          configFile: path.resolve(projectDirectoryPath, "./tsconfig.json")
        }
      }]
    }];
  };

};

IOCContainer.bind(TypeScriptLoaderConfigManger).toSelf().inSingletonScope();