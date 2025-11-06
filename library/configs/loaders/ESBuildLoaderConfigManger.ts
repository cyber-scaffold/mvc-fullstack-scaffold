import os from "os";
import path from "path";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/library/commons/IOCContainer";

@injectable()
export class ESBuildLoaderConfigManger {

  public async getClientSiderLoaderConfig() {
    return [{
      test: /\.(js|jsx|ts|tsx)$/,
      // exclude: /(node_modules)/,
      use: [{
        loader: "esbuild-loader",
        options: {
          // configFile: path.join(process.cwd(), "./.babelrc.js")
        }
      }]
    }];
  };

  public async getServerSiderLoaderConfig() {
    return [{
      test: /\.(js|jsx|ts|tsx)$/,
      // exclude: /(node_modules)/,
      use: [{
        loader: "esbuild-loader",
        options: {
          // configFile: path.join(process.cwd(), "./.babelrc.js")
        }
      }]
    }];
  };

};

IOCContainer.bind(ESBuildLoaderConfigManger).toSelf().inSingletonScope();