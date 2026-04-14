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
    const { extractResourceDirectoryName } = this.$CompilationConfigManager.getRuntimeConfig();
    return [{
      test: /\.less$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            emit: true,
            defaultExport: true,
            publicPath: `/${extractResourceDirectoryName}/`
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
    const { extractResourceDirectoryName } = this.$CompilationConfigManager.getRuntimeConfig();
    return [{
      test: /\.less$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            emit: true,
            defaultExport: true,
            publicPath: `/${extractResourceDirectoryName}/`
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

};

IOCContainer.bind(LessLoaderConfigManager).toSelf().inSingletonScope();