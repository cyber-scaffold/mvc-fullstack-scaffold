import os from "os";
import path from "path";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/library/commons/IOCContainer";

@injectable()
export class ESBuildLoaderConfigManger {

  public async getHydrationSiderLoaderConfig() {
    return [{
      test: /\.(js|jsx|mjs|cjs|ts|tsx)$/,
      include: /(node_modules)/,
      use: [{
        loader: "esbuild-loader"
      }]
    }];
  };

  public async getDehydrationSiderLoaderConfig() {
    return [{
      test: /\.(js|jsx|mjs|cjs|ts|tsx)$/,
      include: /(node_modules)/,
      use: [{
        loader: "esbuild-loader"
      }]
    }];
  };

};

IOCContainer.bind(ESBuildLoaderConfigManger).toSelf().inSingletonScope();