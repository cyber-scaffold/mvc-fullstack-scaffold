import { injectable, inject } from "inversify";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

import { FrameworkConfigManager } from "@/frameworks/configs/FrameworkConfigManager";
import { IOCContainer } from "@/frameworks/configs/IOCContainer";


@injectable()
export class SassLoaderConfigManager {

  constructor(
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager
  ) { };

  public async getClientSiderLoaderConfig() {
    return [{
      test: /\.(scss|sass)$/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
      }, {
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
      }, {
        loader: "postcss-loader",
        options: {
          postcssOptions: {
            config: true
          },
          sourceMap: true
        }
      }, {
        loader: "sass-loader",
        options: {}
      }]
    }]
  };

  public async getServerSiderLoaderConfig() {
    return [{
      test: /\.(scss|sass)$/,
      use: [{
        loader: require.resolve("../utils/ServerSideCssModuleLoader.js")
      }, {
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
      }, {
        loader: "postcss-loader",
        options: {
          postcssOptions: {
            config: true
          },
          sourceMap: true
        }
      }, {
        loader: "sass-loader",
        options: {}
      }]
    }]
  };

};

IOCContainer.bind(SassLoaderConfigManager).toSelf().inSingletonScope();