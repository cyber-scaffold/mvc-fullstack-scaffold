import path from "path";
import { injectable, inject } from "inversify";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

import { IOCContainer } from "@/library/commons/IOCContainer";
import { RuntimeConfigManager } from "@/library/commons/RuntimeConfigManager";

@injectable()
export class LessLoaderConfigManager {

  constructor(
    @inject(RuntimeConfigManager) private readonly $RuntimeConfigManager: RuntimeConfigManager
  ) { };

  public async getHydrationSiderLoaderConfig() {
    return [{
      test: /\.less$/,
      use: [
        { loader: MiniCssExtractPlugin.loader },
        {
          loader: "css-loader",
          options: {
            modules: {
              exportOnlyLocals: false,
              mode: (resourcePath) => {
                if (/\.(module)/.test(resourcePath)) {
                  return "local";
                }
                if (/(node_modules)/.test(resourcePath)) {
                  return "global";
                };
                return "global";
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
        },
        {
          loader: "less-loader",
          options: {
            lessOptions: {
              javascriptEnabled: true,
            },
            implementation: require("less"),
            sourceMap: true
          }
        }
      ]
    }]
  };

  public async getDehydrationSiderLoaderConfig() {
    const { projectDirectoryPath } = this.$RuntimeConfigManager.getRuntimeConfig();
    return [{
      test: /\.less$/,
      use: [
        { loader: path.resolve(projectDirectoryPath, "./library/utils/DehydrationSideCssModuleLoader.js") },
        {
          loader: "css-loader",
          options: {
            modules: {
              exportOnlyLocals: true,
              mode: (resourcePath) => {
                if (/\.(module)/.test(resourcePath)) {
                  return "local";
                }
                if (/(node_modules)/.test(resourcePath)) {
                  return "global";
                };
                return "global";
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
        },
        {
          loader: "less-loader",
          options: {
            lessOptions: {
              javascriptEnabled: true,
            },
            implementation: require("less"),
            sourceMap: true
          }
        }
      ]
    }]
  };

};

IOCContainer.bind(LessLoaderConfigManager).toSelf().inSingletonScope();