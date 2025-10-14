import os from "os";
import { injectable, inject } from "inversify";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";
import { IOCContainer } from "@/frameworks/commons/IOCContainer";


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
    }, {
      loader: "thread-loader",
      options: {
        workers: os.cpus().length - 1,
        workerParallelJobs: 50,
        workerNodeArgs: ['--max-old-space-size=1024'],
        poolRespawn: false,
        poolTimeout: 2000,
        poolParallelJobs: 50,
      },
    }]
  };

  public async getServerSiderLoaderConfig() {
    return [{
      test: /\.(scss|sass)$/,
      use: [{
        loader: require.resolve("../../utils/ServerSideCssModuleLoader.js")
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
      }, {
        loader: "thread-loader",
        options: {
          workers: os.cpus().length - 1,
          workerParallelJobs: 50,
          workerNodeArgs: ['--max-old-space-size=1024'],
          poolRespawn: false,
          poolTimeout: 2000,
          poolParallelJobs: 50,
        },
      }]
    }]
  };

};

IOCContainer.bind(SassLoaderConfigManager).toSelf().inSingletonScope();