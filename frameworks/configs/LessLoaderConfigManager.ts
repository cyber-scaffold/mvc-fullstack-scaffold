import { injectable, inject } from "inversify";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

import { FrameworkConfigManager } from "@/frameworks/configs/FrameworkConfigManager";
import { IOCContainer } from "@/frameworks/configs/IOCContainer";

@injectable()
export class LessLoaderConfigManager {

  constructor(
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager
  ) { };

  public async getClientSiderLoaderConfig() {
    return [{
      test: /\.less$/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
      }, {
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
      }, {
        loader: "postcss-loader",
        options: {
          postcssOptions: {
            config: true
          },
          sourceMap: true
        }
      }, {
        loader: "less-loader",
        options: {
          lessOptions: {
            javascriptEnabled: true,
          },
          implementation: require("less"),
          sourceMap: true
        }
      }]
    }]
  };

  public async getServerSiderLoaderConfig() {
    return [{
      test: /\.less$/,
      use: [{
        loader: require.resolve("../utils/ServerSideCssModuleLoader.js")
      }, {
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
      }, {
        loader: "postcss-loader",
        options: {
          postcssOptions: {
            config: true
          },
          sourceMap: true
        }
      }, {
        loader: "less-loader",
        options: {
          lessOptions: {
            javascriptEnabled: true,
          },
          implementation: require("less"),
          sourceMap: true
        }
      }]
    }]
  };

};

IOCContainer.bind(LessLoaderConfigManager).toSelf().inSingletonScope();