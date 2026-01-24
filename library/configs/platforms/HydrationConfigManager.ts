import path from "path";
import WebpackBar from "webpackbar";
import { merge } from "webpack-merge";
import { injectable, inject } from "inversify";
import { DefinePlugin, Configuration } from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
// import WebpackAssetsManifest from "webpack-assets-manifest";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";

import { IOCContainer } from "@/library/commons/IOCContainer";
import { EventManager } from "@/library/commons/EventManager";
import { FrameworkConfigManager } from "@/library/commons/FrameworkConfigManager";

import { CssLoaderConfigManager } from "@/library/configs/loaders/CssLoaderConfigManager";
import { FileLoaderConfigManager } from "@/library/configs/loaders/FileLoaderConfigManager";
import { LessLoaderConfigManager } from "@/library/configs/loaders/LessLoaderConfigManager";
import { SassLoaderConfigManager } from "@/library/configs/loaders/SassLoaderConfigManager";
// import { BabelLoaderConfigManger } from "@/library/configs/loaders/BabelLoaderConfigManger";
import { ESBuildLoaderConfigManger } from "@/library/configs/loaders/ESBuildLoaderConfigManger";
import { TypeScriptLoaderConfigManger } from "@/library/configs/loaders/TypeScriptLoaderConfigManger";

import { filePathContentHash } from "@/library/utils/filePathContentHash";

@injectable()
export class HydrationConfigManager {

  constructor(
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager,
    @inject(TypeScriptLoaderConfigManger) private readonly $TypeScriptLoaderConfigManger: TypeScriptLoaderConfigManger,
    @inject(ESBuildLoaderConfigManger) private readonly $ESBuildLoaderConfigManger: ESBuildLoaderConfigManger,
    // @inject(BabelLoaderConfigManger) private readonly $BabelLoaderConfigManger: BabelLoaderConfigManger,
    @inject(FileLoaderConfigManager) private readonly $FileLoaderConfigManager: FileLoaderConfigManager,
    @inject(LessLoaderConfigManager) private readonly $LessLoaderConfigManager: LessLoaderConfigManager,
    @inject(SassLoaderConfigManager) private readonly $SassLoaderConfigManager: SassLoaderConfigManager,
    @inject(CssLoaderConfigManager) private readonly $CssLoaderConfigManager: CssLoaderConfigManager,
    @inject(EventManager) private readonly $EventManager: EventManager
  ) { };

  /**
   * 最基础的webpack编译配置
   * **/
  public async getBasicConfig(sourceCodeFilePath: string) {
    const { hydrationResourceDirectoryPath } = await this.$FrameworkConfigManager.getRuntimeConfig();
    return {
      entry: sourceCodeFilePath,
      output: {
        path: hydrationResourceDirectoryPath,
        filename: () => `index-${filePathContentHash(sourceCodeFilePath)}-hydration-[contenthash].js`,
        library: {
          name: "renderHydration",
          type: "window",
          export: "default"
        }
      },
      resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
        alias: {
          "ServerSideCssModuleLoader": path.resolve(process.cwd(), "./library/utils/ServerSideCssModuleLoader.js"),
          "MiniCssExtractPluginLoader": path.resolve(MiniCssExtractPlugin.loader),
          "@@": path.resolve(process.cwd(), "../"),
          "@": process.cwd()
        }
      },
      optimization: {
        nodeEnv: false
      },
      module: {
        rules: (await Promise.all([
          this.$TypeScriptLoaderConfigManger.getClientSiderLoaderConfig(),
          this.$ESBuildLoaderConfigManger.getClientSiderLoaderConfig(),
          // this.$BabelLoaderConfigManger.getClientSiderLoaderConfig(),
          this.$FileLoaderConfigManager.getClientSiderLoaderConfig(),
          this.$LessLoaderConfigManager.getClientSiderLoaderConfig(),
          this.$SassLoaderConfigManager.getClientSiderLoaderConfig(),
          this.$CssLoaderConfigManager.getClientSiderLoaderConfig()
        ])).flat()
      },
      plugins: [
        new DefinePlugin({
          "process.isClient": JSON.stringify(true),
          "process.isServer": JSON.stringify(false)
        }),
        new NodePolyfillPlugin(),
        new WebpackBar({ name: "编译水合化渲染资源" }),
        new MiniCssExtractPlugin({
          linkType: "text/css",
          filename: () => `index-${filePathContentHash(sourceCodeFilePath)}-hydration-[contenthash].css`
        })
      ]
    };
  };

  /**
   * 开发模式下的webpack配置
   * **/
  public async getDevelopmentConfig(sourceCodeFilePath: string) {
    const basicConfig: any = await this.getBasicConfig(sourceCodeFilePath);
    // const WebpackAssetsManifestPlugin = new WebpackAssetsManifest();
    // WebpackAssetsManifestPlugin.hooks.apply.tap("AddENV", (manifest) => {
    //   manifest.set("env", "development");
    // });
    return merge<Configuration>(basicConfig, {
      mode: "development",
      devtool: "source-map"
    });
  };

  /**
   * 生产模式下的webpack配置
   * **/
  public async getProductionConfig(sourceCodeFilePath: string) {
    const basicConfig: any = await this.getBasicConfig(sourceCodeFilePath);
    // const WebpackAssetsManifestPlugin = new WebpackAssetsManifest();
    // WebpackAssetsManifestPlugin.hooks.apply.tap("AddENV", (manifest) => {
    //   manifest.set("env", "production");
    // });
    return merge<Configuration>(basicConfig, {
      mode: "production",
      devtool: false
    });
  };

};

IOCContainer.bind(HydrationConfigManager).toSelf().inRequestScope();