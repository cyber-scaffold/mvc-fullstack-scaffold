import os from "os";
import path from "path";
import { injectable, inject } from "inversify";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

import { IOCContainer } from "@/library/commons/IOCContainer";
import { RuntimeConfigManager } from "@/library/commons/RuntimeConfigManager";

@injectable()
export class CssLoaderConfigManager {

  constructor(
    @inject(RuntimeConfigManager) private readonly $RuntimeConfigManager: RuntimeConfigManager
  ) { };

  public async getHydrationSiderLoaderConfig() {
    return [{
      test: /\.(css)$/,
      use: [
        { loader: MiniCssExtractPlugin.loader },
        {
          loader: "css-loader",
          options: {
            modules: {
              exportOnlyLocals: false,
              mode: (resourcePath) => {
                if (/\.(global)/.test(resourcePath)) {
                  return "global";
                }
                if (/(node_modules)/.test(resourcePath)) {
                  return "global";
                };
                return "local";
              }
            },
            sourceMap: true
          }
        },
        {
          loader: "postcss-loader",
          options: {
            postcssOptions: {
              config: true
            },
            sourceMap: true
          }
        }
      ]
    }];
  };

  public async getDehydrationSiderLoaderConfig() {
    const { projectDirectoryPath } = this.$RuntimeConfigManager.getRuntimeConfig();
    return [{
      test: /\.(css)$/,
      use: [
        { loader: path.resolve(projectDirectoryPath, "./library/utils/DehydrationSideCssModuleLoader.js") },
        {
          loader: "css-loader",
          options: {
            modules: {
              exportOnlyLocals: true,
              mode: (resourcePath) => {
                if (/\.(global)/.test(resourcePath)) {
                  return "global";
                }
                if (/(node_modules)/.test(resourcePath)) {
                  return "global";
                };
                return "local";
              }
            },
            sourceMap: true
          }
        },
        {
          loader: "postcss-loader",
          options: {
            postcssOptions: {
              config: true
            },
            sourceMap: true
          }
        }
      ]
    }];
  };

};

IOCContainer.bind(CssLoaderConfigManager).toSelf().inSingletonScope();