import path from "path";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/mpa-ssr-tool-box/compilation/cores/IOCContainer";
import { CompilationConfigManager } from "@/frameworks/mpa-ssr-tool-box/compilation/commons/CompilationConfigManager";

@injectable()
export class TypeScriptLoaderConfigManger {

  constructor (
    @inject(CompilationConfigManager) private readonly $CompilationConfigManager: CompilationConfigManager
  ) { };

  public async getHydrationSiderLoaderConfig() {
    const { projectDirectoryPath } = this.$CompilationConfigManager.getRuntimeConfig();
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
    const { projectDirectoryPath } = this.$CompilationConfigManager.getRuntimeConfig();
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