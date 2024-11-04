import path from "path";
import { injectable, inject } from "inversify";

import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";
import { IOCContainer } from "@/frameworks/commons/IOCContainer";

@injectable()
export class BabelLoaderConfigManger {

  constructor(
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager
  ) { };

  public async getClientSiderLoaderConfig() {
    return [{
      test: /\.(js|jsx)$/,
      exclude: /(node_modules)/,
      use: [{
        loader: "babel-loader",
        options: {
          configFile: path.join(process.cwd(), "./.babelrc.js")
        }
      }]
    }];
  };

  public async getServerSiderLoaderConfig() {
    return [{
      test: /\.(js|jsx)$/,
      exclude: /(node_modules)/,
      use: [{
        loader: "babel-loader",
        options: {
          configFile: path.join(process.cwd(), "./.babelrc.js")
        }
      }]
    }];
  };

};

IOCContainer.bind(BabelLoaderConfigManger).toSelf().inSingletonScope();