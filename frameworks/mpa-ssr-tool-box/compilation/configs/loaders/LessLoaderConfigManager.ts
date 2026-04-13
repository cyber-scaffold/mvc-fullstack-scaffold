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
            defaultExport: true,
            publicPath: `/${fileResourceDirectoryName}/`
          }
        },
        {
          loader: "css-loader",
          options: {
            modules: {
              namedExport: true,
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
    const { fileResourceDirectoryName } = this.$CompilationConfigManager.getRuntimeConfig();
    return [{
      test: /\.less$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            defaultExport: true,
            publicPath: `/${fileResourceDirectoryName}/`
          }
        },
        {
          loader: "css-loader",
          options: {
            modules: {
              namedExport: true,
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