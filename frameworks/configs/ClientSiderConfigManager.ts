import path from "path";
import WebpackBar from "webpackbar";
import { merge } from "webpack-merge";
import { Configuration } from "webpack";
import { injectable, inject } from "inversify";
import CopyWebpackPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import WebpackAssetsManifest from "webpack-assets-manifest";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";

import { IOCContainer } from "@/frameworks/configs/IOCContainer";
import { CssLoaderConfigManager } from "@/frameworks/configs/CssLoaderConfigManager";
import { FileLoaderConfigManager } from "@/frameworks/configs/FileLoaderConfigManager";
import { LessLoaderConfigManager } from "@/frameworks/configs/LessLoaderConfigManager";
import { SassLoaderConfigManager } from "@/frameworks/configs/SassLoaderConfigManager";
import { BabelLoaderConfigManger } from "@/frameworks/configs/BabelLoaderConfigManger";
import { TypeScriptLoaderConfigManger } from "@/frameworks/configs/TypeScriptLoaderConfigManger";

import { CompilerProgressService } from "@/frameworks/services/CompilerProgressService";
import { ClientCompilerProgressPlugin } from "@/frameworks/utils/ClientCompilerProgressPlugin";

@injectable()
export class ClientSiderConfigManager {

  constructor(
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
    return {
      entry: path.resolve(process.cwd(), "./sources/views/index.tsx"),
      devtool: "source-map",
      resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
        alias: {
          "@@": path.resolve(process.cwd(), "../"),
          "@": process.cwd()
        }
      },
      optimization: {
        nodeEnv: false
      },
      module: {
        rules: [
          await this.$TypeScriptLoaderConfigManger.getClientSiderLoaderConfig(),
          await this.$BabelLoaderConfigManger.getClientSiderLoaderConfig(),
          await this.$FileLoaderConfigManager.getClientSiderLoaderConfig(),
          await this.$LessLoaderConfigManager.getClientSiderLoaderConfig(),
          await this.$SassLoaderConfigManager.getClientSiderLoaderConfig(),
          await this.$CssLoaderConfigManager.getClientSiderLoaderConfig()
        ].flat()
      },
      plugins: [
        new NodePolyfillPlugin(),
        new WebpackAssetsManifest(),
        new WebpackBar({ name: "编译客户端" }),
        new CopyWebpackPlugin({
          patterns: [{
            from: path.resolve(process.cwd(), "./sources/resources/"),
            to: path.resolve(process.cwd(), "./dist/applications")
          }]
        }),
        new ClientCompilerProgressPlugin(this.$CompilerProgressService)
      ]
    };
  };

  /**
   * 开发模式下的webpack配置
   * **/
  public async getDevelopmentConfig() {
    const basicConfig: any = await this.getBasicConfig();
    return merge<Configuration>(basicConfig, {
      mode: "development",
      output: {
        path: path.resolve(process.cwd(), "./dist/applications/"),
        filename: "main.js",
      },
      plugins: [
        new MiniCssExtractPlugin({
          linkType: "text/css",
          filename: "[name].css"
        }),
      ]
    });
  };

  /**
   * 生产模式下的webpack配置
   * **/
  public async getProductionConfig() {
    const basicConfig: any = await this.getBasicConfig();
    return merge<Configuration>(basicConfig, {
      mode: "production",
      output: {
        path: path.resolve(process.cwd(), "./dist/applications/"),
        filename: "main-[contenthash].js",
      },
      plugins: [
        new MiniCssExtractPlugin({
          linkType: "text/css",
          filename: "[name]-[contenthash].css"
        }),
      ]
    });
  };

};

IOCContainer.bind(ClientSiderConfigManager).toSelf().inSingletonScope();