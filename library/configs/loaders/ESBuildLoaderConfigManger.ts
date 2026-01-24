import os from "os";
import path from "path";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/library/commons/IOCContainer";

@injectable()
export class ESBuildLoaderConfigManger {

  public async getClientSiderLoaderConfig() {
    return [{
      test: /\.(js|jsx|mjs|cjs|ts|tsx)$/,
      include: /(node_modules)/,
      use: [{
        loader: "esbuild-loader"
      }]
    }];
  };

  public async getServerSiderLoaderConfig() {
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