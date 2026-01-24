import path from "path";
import { merge } from "webpack-merge";
import { injectable, inject } from "inversify";
import nodeExternals from "webpack-node-externals";
import CopyWebpackPlugin from "copy-webpack-plugin";
import { Configuration } from "webpack";

import { IOCContainer } from "@/frameworks/commons/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";

import { ESBuildLoaderConfigManger } from "@/frameworks/configs/loaders/ESBuildLoaderConfigManger";


@injectable()
export class ServerSiderConfigManager {

  constructor(
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager,
    @inject(ESBuildLoaderConfigManger) private readonly $ESBuildLoaderConfigManger: ESBuildLoaderConfigManger
  ) { };

  /**
   * 最基础的webpack编译配置
   * **/
  public async getBasicConfig() {
    const { resources, destnation, serverCompilerConfig: { source } } = this.$FrameworkConfigManager.getRuntimeConfig();
    return {
      entry: ["source-map-support/register", path.resolve(source, "./index.ts")],
      target: "node",
      resolve: {
        extensions: [".ts", ".js"],
        alias: {
          "@@": path.resolve(process.cwd(), "../"),
          "@": process.cwd()
        }
      },
      externalsPresets: { node: true },
      externals: [nodeExternals({
        modulesFromFile: path.resolve(process.cwd(), "./package.json")
      })],
      optimization: {
        nodeEnv: false
      },
      module: {
        rules: [
          await this.$ESBuildLoaderConfigManger.getServerSiderLoaderConfig(),
        ].flat()
      },
      plugins: [
        new CopyWebpackPlugin({
          patterns: [{
            from: resources.source,
            to: path.resolve(destnation, "./frameworks/")
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
    const { destnation } = this.$FrameworkConfigManager.getRuntimeConfig();
    return merge<Configuration>(basicConfig, {
      devtool: "source-map",
      mode: "development",
      output: {
        path: destnation,
        filename: "server.js",
      },
    });
  };

  /**
   * 生产模式下的webpack配置
   * **/
  public async getProductionConfig() {
    const basicConfig: any = await this.getBasicConfig();
    const { destnation } = this.$FrameworkConfigManager.getRuntimeConfig();
    return merge<Configuration>(basicConfig, {
      mode: "none",
      devtool: "source-map",
      output: {
        path: destnation,
        filename: "server.js",
      },
    });
  };

};

IOCContainer.bind(ServerSiderConfigManager).toSelf().inSingletonScope();