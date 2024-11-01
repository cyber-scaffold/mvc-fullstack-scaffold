import path from "path";
import { injectable, inject } from "inversify";

import { ApplicationConfigManager } from "@/frameworks/configs/ApplicationConfigManager";
import { IOCContainer } from "@/frameworks/configs/IOCContainer";

@injectable()
export class BabelLoaderConfigManger {

  constructor(
    @inject(ApplicationConfigManager) private readonly $ApplicationConfigManager: ApplicationConfigManager
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