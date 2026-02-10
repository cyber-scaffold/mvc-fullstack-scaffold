import WebpackBar from "webpackbar";
import { merge } from "webpack-merge";
import { Configuration } from "webpack";
import { injectable, inject } from "inversify";
import CopyWebpackPlugin from "copy-webpack-plugin";

import { IOCContainer } from "@/frameworks/commons/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";

import { ESBuildLoaderConfigManger } from "@/frameworks/configs/loaders/ESBuildLoaderConfigManger";
import { TypeScriptLoaderConfigManger } from "@/frameworks/configs/loaders/TypeScriptLoaderConfigManger";


@injectable()
export class ServerSiderConfigManager {

  constructor(
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager,
    @inject(ESBuildLoaderConfigManger) private readonly $ESBuildLoaderConfigManger: ESBuildLoaderConfigManger,
    @inject(TypeScriptLoaderConfigManger) private readonly $TypeScriptLoaderConfigManger: TypeScriptLoaderConfigManger
  ) { };

  /**
   * 最基础的webpack编译配置
   * **/
  public async getBasicConfig() {
    const { entryFile, staticSourceDirectoryPath, staticDestinationDirectoryPath } = this.$FrameworkConfigManager.getRuntimeConfig();
    return {
      entry: ["source-map-support/register", entryFile],
      target: "node",
      resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
        alias: {
          "@": process.cwd()
        }
      },
      externalsPresets: { node: true },
      externals: [{
        "less": "commonjs less",
        "express": "commonjs express",
        "less-node": "commonjs less-node",
        "webpack": "commonjs webpack",
        "webpackbar": "commonjs webpackbar",
        "webpack-merge": "commonjs webpack-merge",
        "copy-webpack-plugin": "commonjs copy-webpack-plugin",
        "terser-webpack-plugin": "commonjs terser-webpack-plugin",
        "webpack-node-externals": "commonjs webpack-node-externals",
        "webpack-assets-manifest": "commonjs webpack-assets-manifest",
        "mini-css-extract-plugin": "commonjs mini-css-extract-plugin",
        "node-polyfill-webpack-plugin": "commonjs node-polyfill-webpack-plugin",
        "react": "commonjs react",
        "react-dom": "commonjs react-dom",
        "inversify": "commonjs inversify",
        "typeorm": "commonjs typeorm",
        "mongodb": "commonjs mongodb",
        "amqplib": "commonjs amqplib",
        "redis": "commonjs redis",
        "knex": "commonjs knex"
      }],
      optimization: {
        nodeEnv: false
      },
      module: {
        rules: (await Promise.all([
          this.$ESBuildLoaderConfigManger.getServerSiderLoaderConfig(),
          this.$TypeScriptLoaderConfigManger.getServerSiderLoaderConfig()
        ])).flat()
      },
      plugins: [
        new WebpackBar({ name: "工程编译中" }),
        new CopyWebpackPlugin({
          patterns: [{
            from: staticSourceDirectoryPath,
            to: staticDestinationDirectoryPath
          }]
        })
      ]
    };
  };

  /**
 * 开发模式下的webpack配置
 * **/
  public async getDevelopmentConfig() {
    const basicConfig: any = await this.getBasicConfig();
    const { assetsDirectoryPath } = this.$FrameworkConfigManager.getRuntimeConfig();
    return merge<Configuration>(basicConfig, {
      devtool: "source-map",
      mode: "development",
      output: {
        path: assetsDirectoryPath,
        filename: "server.js",
      },
    });
  };

  /**
   * 生产模式下的webpack配置
   * **/
  public async getProductionConfig() {
    const basicConfig: any = await this.getBasicConfig();
    const { assetsDirectoryPath } = this.$FrameworkConfigManager.getRuntimeConfig();
    return merge<Configuration>(basicConfig, {
      mode: "none",
      devtool: "source-map",
      output: {
        path: assetsDirectoryPath,
        filename: "server.js",
      },
    });
  };

};

IOCContainer.bind(ServerSiderConfigManager).toSelf().inSingletonScope();