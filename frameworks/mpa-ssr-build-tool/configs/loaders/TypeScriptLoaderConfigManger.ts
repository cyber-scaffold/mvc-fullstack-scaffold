import path from "path";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/mpa-ssr-build-tool/cores/IOCContainer";

@injectable()
export class TypeScriptLoaderConfigManger {

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