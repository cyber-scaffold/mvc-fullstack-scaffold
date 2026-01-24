import os from "os";
import path from "path";
import { injectable, inject } from "inversify";

import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";
import { IOCContainer } from "@/frameworks/commons/IOCContainer";

@injectable()
export class ESBuildLoaderConfigManger {

  constructor(
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager
  ) { };

  public async getClientSiderLoaderConfig() {
    return [{
      test: /\.(js|jsx|mjs|cjs|ts|tsx)$/,
      include: /(node_modules)/,
      use: [{
        loader: "esbuild-loader",
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