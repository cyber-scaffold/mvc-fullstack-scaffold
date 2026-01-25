import os from "os";
import path from "path";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/library/commons/IOCContainer";

@injectable()
export class BabelLoaderConfigManger {

  public async getHydrationSiderLoaderConfig() {
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

  public async getDehydrationSiderLoaderConfig() {
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