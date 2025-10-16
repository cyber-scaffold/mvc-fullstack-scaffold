import path from "path";
import WebpackBar from "webpackbar";
import { merge } from "webpack-merge";
import { injectable, inject } from "inversify";
import nodeExternals from "webpack-node-externals";
import CopyWebpackPlugin from "copy-webpack-plugin";
import { DefinePlugin, Configuration } from "webpack";

import { IOCContainer } from "@/library/commons/IOCContainer";
import { EventManager } from "@/library/commons/EventManager";
import { FrameworkConfigManager } from "@/library/commons/FrameworkConfigManager";

import { TypeScriptLoaderConfigManger } from "@/library/configs/loaders/TypeScriptLoaderConfigManger";
import { BabelLoaderConfigManger } from "@/library/configs/loaders/BabelLoaderConfigManger";
import { FileLoaderConfigManager } from "@/library/configs/loaders/FileLoaderConfigManager";
import { LessLoaderConfigManager } from "@/library/configs/loaders/LessLoaderConfigManager";
import { SassLoaderConfigManager } from "@/library/configs/loaders/SassLoaderConfigManager";
import { CssLoaderConfigManager } from "@/library/configs/loaders/CssLoaderConfigManager";


import { ServerCompilerProgressPlugin } from "@/library/utils/ServerCompilerProgressPlugin";

@injectable()
export class ServerSiderConfigManager {

  constructor(
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager,
    @inject(TypeScriptLoaderConfigManger) private readonly $TypeScriptLoaderConfigManger: TypeScriptLoaderConfigManger,
    @inject(BabelLoaderConfigManger) private readonly $BabelLoaderConfigManger: BabelLoaderConfigManger,
    @inject(FileLoaderConfigManager) private readonly $FileLoaderConfigManager: FileLoaderConfigManager,
    @inject(LessLoaderConfigManager) private readonly $LessLoaderConfigManager: LessLoaderConfigManager,
    @inject(SassLoaderConfigManager) private readonly $SassLoaderConfigManager: SassLoaderConfigManager,
    @inject(CssLoaderConfigManager) private readonly $CssLoaderConfigManager: CssLoaderConfigManager,
    @inject(EventManager) private readonly $EventManager: EventManager
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
        extensions: [".ts", ".tsx", ".js", ".jsx"],
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
          await this.$TypeScriptLoaderConfigManger.getServerSiderLoaderConfig(),
          await this.$BabelLoaderConfigManger.getServerSiderLoaderConfig(),
          await this.$FileLoaderConfigManager.getServerSiderLoaderConfig(),
          await this.$LessLoaderConfigManager.getServerSiderLoaderConfig(),
          await this.$SassLoaderConfigManager.getServerSiderLoaderConfig(),
          await this.$CssLoaderConfigManager.getServerSiderLoaderConfig()
        ].flat()
      },
      plugins: [
        new DefinePlugin({
          "process.isClient": JSON.stringify(false),
          "process.isServer": JSON.stringify(true)
        }),
        new WebpackBar({ name: "编译服务端" }),
        new CopyWebpackPlugin({
          patterns: [{
            from: resources.source,
            to: path.resolve(destnation, "./frameworks/")
          }]
        }),
        new ServerCompilerProgressPlugin(this.$EventManager)
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