import path from "path";
import { injectable, inject } from "inversify";

import { FrameworkConfigManager } from "@/frameworks/configs/FrameworkConfigManager";
import { IOCContainer } from "@/frameworks/configs/IOCContainer";

@injectable()
export class TypeScriptLoaderConfigManger {

  constructor(
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager
  ) { };

  public async getClientSiderLoaderConfig() {
    return [{
      test: /\.(ts|tsx)$/,
      exclude: /(node_modules)/,
      use: [{
        loader: "ts-loader",
        options: {
          configFile: path.resolve(process.cwd(), "./tsconfig.json")
        }
      }]
    }];
  };

  public async getServerSiderLoaderConfig() {
    return [{
      test: /\.(ts|tsx)$/,
      exclude: /(node_modules)/,
      use: [{
        loader: "ts-loader",
        options: {
          configFile: path.resolve(process.cwd(), "./tsconfig.json")
        }
      }]
    }];
  };

};

IOCContainer.bind(TypeScriptLoaderConfigManger).toSelf().inSingletonScope();