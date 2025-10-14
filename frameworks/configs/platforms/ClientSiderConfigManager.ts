import path from "path";
import { fromPairs } from "lodash";
import WebpackBar from "webpackbar";
import { merge } from "webpack-merge";
import { DefinePlugin, Configuration } from "webpack";
import { injectable, inject, interfaces } from "inversify";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import WebpackAssetsManifest from "webpack-assets-manifest";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";

import { IOCContainer } from "@/frameworks/commons/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";

import { CssLoaderConfigManager } from "@/frameworks/configs/loaders/CssLoaderConfigManager";
import { FileLoaderConfigManager } from "@/frameworks/configs/loaders/FileLoaderConfigManager";
import { LessLoaderConfigManager } from "@/frameworks/configs/loaders/LessLoaderConfigManager";
import { SassLoaderConfigManager } from "@/frameworks/configs/loaders/SassLoaderConfigManager";
import { BabelLoaderConfigManger } from "@/frameworks/configs/loaders/BabelLoaderConfigManger";
import { TypeScriptLoaderConfigManger } from "@/frameworks/configs/loaders/TypeScriptLoaderConfigManger";

import { CompilerProgressService } from "@/frameworks/services/progress/CompilerProgressService";
import { WebpackCompilerFileType } from "@/frameworks/services/preprocess/InspectDirectivePrologueService";

import { ClientCompilerProgressPlugin } from "@/frameworks/utils/ClientCompilerProgressPlugin";

/**
 * 因为视图层是多页面,而且文件随时都有可能改变,所以视图层的编译模块必须是瞬态的,方便每次都获取到最新的列表
 * **/

export type ClientSiderConfigManagerProvider = () => ClientSiderConfigManager;

export function ClientSiderConfigManagerFactory(context: interfaces.Context): ClientSiderConfigManagerProvider {
  return function ClientSiderConfigManagerProvider(): ClientSiderConfigManager {
    return context.container.get(ClientSiderConfigManager);
  };
};

@injectable()
export class ClientSiderConfigManager {

  private compilerFileEntryList: {
    [outputName: string]: string
  } = {};

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

  /** 注入文件的编译信息 **/
  public setCompilerFileInfoList(compilerFileInfoList: WebpackCompilerFileType[]) {
    const compilerFileInfoPairs = compilerFileInfoList.map((everyCompilerFileInfo: WebpackCompilerFileType) => {
      const { entry, output } = everyCompilerFileInfo;
      const outputFilename = path.basename(output);
      return [outputFilename, entry];
    });
    this.compilerFileEntryList = fromPairs(compilerFileInfoPairs);
  };

  /**
   * 最基础的webpack编译配置
   * **/
  public async getBasicConfig() {
    const { destnation } = this.$FrameworkConfigManager.getRuntimeConfig();
    return {
      output: {
        path: path.join(destnation, "./views/"),
        filename: "[name]-[contenthash].js"
      },
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
        new DefinePlugin({
          "process.isClient": JSON.stringify(true),
          "process.isServer": JSON.stringify(false)
        }),
        new NodePolyfillPlugin(),
        new WebpackBar({ name: "编译客户端" }),
        new ClientCompilerProgressPlugin(this.$CompilerProgressService)
      ]
    };
  };

  /**
   * 开发模式下的webpack配置
   * **/
  public async getDevelopmentConfig() {
    const basicConfig: any = await this.getBasicConfig();
    const WebpackAssetsManifestPlugin = new WebpackAssetsManifest();
    WebpackAssetsManifestPlugin.hooks.apply.tap("AddENV", (manifest) => {
      manifest.set("env", "development");
    });
    return merge<Configuration>(basicConfig, {
      mode: "development",
      devtool: "source-map",
      entry: this.compilerFileEntryList,
      plugins: [
        WebpackAssetsManifestPlugin,
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
    const WebpackAssetsManifestPlugin = new WebpackAssetsManifest();
    WebpackAssetsManifestPlugin.hooks.apply.tap("AddENV", (manifest) => {
      manifest.set("env", "production");
    });
    return merge<Configuration>(basicConfig, {
      mode: "production",
      devtool: false,
      entry: this.compilerFileEntryList,
      plugins: [
        WebpackAssetsManifestPlugin,
        new MiniCssExtractPlugin({
          linkType: "text/css",
          filename: "[name]-[contenthash].css"
        }),
      ]
    });
  };

};

IOCContainer.bind(ClientSiderConfigManager).toSelf().inTransientScope();
IOCContainer.bind(ClientSiderConfigManagerFactory).toFactory(ClientSiderConfigManagerFactory);