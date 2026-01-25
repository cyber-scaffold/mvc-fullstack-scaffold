import os from "os";
import path from "path";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/library/commons/IOCContainer";

@injectable()
export class BabelLoaderConfigManger {

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