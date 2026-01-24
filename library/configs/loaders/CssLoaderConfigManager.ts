import os from "os";
import path from "path";
import { injectable, inject } from "inversify";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

import { IOCContainer } from "@/library/commons/IOCContainer";

@injectable()
export class CssLoaderConfigManager {

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
        loader: path.resolve(process.cwd(), "./library/utils/ServerSideCssModuleLoader.js")
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