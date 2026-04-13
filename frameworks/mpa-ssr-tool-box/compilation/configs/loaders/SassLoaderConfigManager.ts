import path from "path";
import { injectable, inject } from "inversify";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

import { IOCContainer } from "@/frameworks/mpa-ssr-tool-box/compilation/cores/IOCContainer";
import { CompilationConfigManager } from "@/frameworks/mpa-ssr-tool-box/compilation/commons/CompilationConfigManager";

@injectable()
export class SassLoaderConfigManager {

  constructor (
    @inject(CompilationConfigManager) private readonly $CompilationConfigManager: CompilationConfigManager
  ) { };

  public async getHydrationSiderLoaderConfig() {
    const { fileResourceDirectoryName } = this.$CompilationConfigManager.getRuntimeConfig();
    return [{
      test: /\.(scss|sass)$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: `/${fileResourceDirectoryName}/`
          }
        },
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
        },
        {
          loader: "sass-loader",
          options: {}
        }
      ]
    }]
  };

  public async getDehydrationSiderLoaderConfig() {
    const { projectDirectoryPath } = this.$CompilationConfigManager.getRuntimeConfig();
    return [{
      test: /\.(scss|sass)$/,
      use: [
        { loader: path.resolve(projectDirectoryPath, "./frameworks/mpa-ssr-tool-box/compilation/utils/DehydrationSideCssModuleLoader.js") },
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
        },
        {
          loader: "sass-loader",
          options: {}
        }
      ]
    }]
  };

};

IOCContainer.bind(SassLoaderConfigManager).toSelf().inSingletonScope();