import { injectable, inject } from "inversify";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

import { ApplicationConfigManager } from "@/frameworks/configs/ApplicationConfigManager";
import { IOCContainer } from "@/frameworks/configs/IOCContainer";

@injectable()
export class CssLoaderConfigManager {

  constructor(
    @inject(ApplicationConfigManager) private readonly $ApplicationConfigManager: ApplicationConfigManager
  ) { };

  public async getClientSiderLoaderConfig() {
    return [{
      test: /\.(css)$/,
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
      }]
    }];
  };

  public async getServerSiderLoaderConfig() {
    return [{
      test: /\.(css)$/,
      use: [{
        loader: require.resolve("../utils/ServerSideCssModuleLoader.js"),
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
      }]
    }];
  };

};

IOCContainer.bind(CssLoaderConfigManager).toSelf().inSingletonScope();