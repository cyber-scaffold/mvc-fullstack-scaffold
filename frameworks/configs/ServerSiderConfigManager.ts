import path from "path";
import WebpackBar from "webpackbar";
import { merge } from "webpack-merge";
import { Configuration } from "webpack";
import { injectable, inject } from "inversify";
import nodeExternals from "webpack-node-externals";

import { IOCContainer } from "@/frameworks/configs/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/configs/FrameworkConfigManager";
import { TypeScriptLoaderConfigManger } from "@/frameworks/configs/TypeScriptLoaderConfigManger";
import { BabelLoaderConfigManger } from "@/frameworks/configs/BabelLoaderConfigManger";
import { FileLoaderConfigManager } from "@/frameworks/configs/FileLoaderConfigManager";
import { LessLoaderConfigManager } from "@/frameworks/configs/LessLoaderConfigManager";
import { SassLoaderConfigManager } from "@/frameworks/configs/SassLoaderConfigManager";
import { CssLoaderConfigManager } from "@/frameworks/configs/CssLoaderConfigManager";

import { CompilerProgressService } from "@/frameworks/services/CompilerProgressService";
import { ServerCompilerProgressPlugin } from "@/frameworks/utils/ServerCompilerProgressPlugin";

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
    @inject(CompilerProgressService) private readonly $CompilerProgressService: CompilerProgressService
  ) { };

  /**
   * 最基础的webpack编译配置
   * **/
  public async getBasicConfig() {
    const { source } = this.$FrameworkConfigManager.getRuntimeConfig();
    return {
      mode: "none",
      entry: path.resolve(source, "./index.ts"),
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
        new WebpackBar({ name: "编译服务端" }),
        new ServerCompilerProgressPlugin(this.$CompilerProgressService)
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
      devtool: false,
      output: {
        path: destnation,
        filename: "server.js",
      },
    });
  };

};

IOCContainer.bind(ServerSiderConfigManager).toSelf().inSingletonScope();