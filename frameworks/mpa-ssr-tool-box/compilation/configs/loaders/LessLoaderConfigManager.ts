import path from "path";
import { injectable, inject } from "inversify";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

import { IOCContainer } from "@/frameworks/mpa-ssr-tool-box/compilation/cores/IOCContainer";
import { CompilationConfigManager } from "@/frameworks/mpa-ssr-tool-box/compilation/commons/CompilationConfigManager";

@injectable()
export class LessLoaderConfigManager {

  constructor (
    @inject(CompilationConfigManager) private readonly $CompilationConfigManager: CompilationConfigManager
  ) { };

  public async getHydrationSiderLoaderConfig() {
    const { fileResourceDirectoryName } = this.$CompilationConfigManager.getRuntimeConfig();
    return [{
      test: /\.less$/,
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
    const { projectDirectoryPath } = this.$CompilationConfigManager.getRuntimeConfig();
    return [{
      test: /\.less$/,
      use: [
        { loader: path.resolve(projectDirectoryPath, "./frameworks/mpa-ssr-tool-box/compilation/utils/DehydrationSideCssModuleLoader.js") },
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