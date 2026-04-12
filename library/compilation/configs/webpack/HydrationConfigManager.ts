import path from "path";
import WebpackBar from "webpackbar";
import { merge } from "webpack-merge";
import { injectable, inject } from "inversify";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
import { webpack, DllReferencePlugin, DefinePlugin } from "webpack";

import { IOCContainer } from "@/library/compilation/cores/IOCContainer";
import { CompilationConfigManager } from "@/library/compilation/commons/CompilationConfigManager";

import { CompilationMaterielResourceDatabaseManager } from "@/library/compilation/commons/CompilationMaterielResourceDatabaseManager";
import { CssLoaderConfigManager } from "@/library/compilation/configs/loaders/CssLoaderConfigManager";
import { FileLoaderConfigManager } from "@/library/compilation/configs/loaders/FileLoaderConfigManager";
import { LessLoaderConfigManager } from "@/library/compilation/configs/loaders/LessLoaderConfigManager";
import { SassLoaderConfigManager } from "@/library/compilation/configs/loaders/SassLoaderConfigManager";
import { ESBuildLoaderConfigManger } from "@/library/compilation/configs/loaders/ESBuildLoaderConfigManger";
import { TypeScriptLoaderConfigManger } from "@/library/compilation/configs/loaders/TypeScriptLoaderConfigManger";

import { ConvertHydrationEntryFile } from "@/library/compilation/services/ConvertHydrationEntryFile";
import { CompilerProgressPlugin } from "@/library/compilation/utils/CompilerProgressPlugin";

import type { PathData, Compiler, Configuration } from "webpack";

@injectable()
export class HydrationConfigManager {

  constructor (
    @inject(CompilationMaterielResourceDatabaseManager) private readonly $CompilationMaterielResourceDatabaseManager: CompilationMaterielResourceDatabaseManager,
    @inject(ConvertHydrationEntryFile) private readonly $ConvertHydrationEntryFile: ConvertHydrationEntryFile,
    @inject(TypeScriptLoaderConfigManger) private readonly $TypeScriptLoaderConfigManger: TypeScriptLoaderConfigManger,
    @inject(ESBuildLoaderConfigManger) private readonly $ESBuildLoaderConfigManger: ESBuildLoaderConfigManger,
    @inject(FileLoaderConfigManager) private readonly $FileLoaderConfigManager: FileLoaderConfigManager,
    @inject(LessLoaderConfigManager) private readonly $LessLoaderConfigManager: LessLoaderConfigManager,
    @inject(SassLoaderConfigManager) private readonly $SassLoaderConfigManager: SassLoaderConfigManager,
    @inject(CssLoaderConfigManager) private readonly $CssLoaderConfigManager: CssLoaderConfigManager,
    @inject(CompilationConfigManager) private readonly $CompilationConfigManager: CompilationConfigManager
  ) { };

  /**
   * 最基础的webpack编译配置
   * **/
  public async getBasicConfig(): Promise<Configuration> {
    const { hydrationResourceDirectoryPath, projectDirectoryPath } = await this.$CompilationConfigManager.getRuntimeConfig();
    return {
      entry: this.$ConvertHydrationEntryFile.getWebpackEntryPoints(),
      output: {
        path: hydrationResourceDirectoryPath,
        filename: (pathData: PathData) => `index-${pathData.chunk.name}-hydration-[contenthash].js`,
      },
      resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
        alias: {
          "@": projectDirectoryPath
        }
      },
      optimization: {
        nodeEnv: false
      },
      module: {
        rules: (await Promise.all([
          this.$TypeScriptLoaderConfigManger.getHydrationSiderLoaderConfig(),
          this.$ESBuildLoaderConfigManger.getHydrationSiderLoaderConfig(),
          this.$FileLoaderConfigManager.getHydrationSiderLoaderConfig(),
          this.$LessLoaderConfigManager.getHydrationSiderLoaderConfig(),
          this.$SassLoaderConfigManager.getHydrationSiderLoaderConfig(),
          this.$CssLoaderConfigManager.getHydrationSiderLoaderConfig()
        ])).flat()
      },
      plugins: [
        new WebpackBar({ name: "制作注水物料" }),
        new NodePolyfillPlugin(),
        // new DllReferencePlugin({
        //   manifest: path.resolve(assetsDirectoryPath, "./dll/hydration.dll.json")
        // }),
        new CompilerProgressPlugin({
          type: "hydration",
          materielResourceDatabaseManager: this.$CompilationMaterielResourceDatabaseManager
        }),
        new DefinePlugin({
          "process.env.RESOURCE_TYPE": JSON.stringify("hydration"),
          "process.env.NODE_ENV": "window._INJECT_RUNTIME_FROM_SERVER_.env.NODE_ENV"
        }),
        new MiniCssExtractPlugin({
          linkType: "text/css",
          filename: (pathData: PathData) => `index-${pathData.chunk.name}-hydration-[contenthash].css`
        })
      ]
    };
  };

  /**
   * 开发模式下的webpack配置
   * **/
  public async getWebpackDevelopmentCompiler(): Promise<Compiler> {
    const basicConfig: Configuration = await this.getBasicConfig();
    const webpackCompiler = webpack(merge<Configuration>(basicConfig, {
      mode: "development",
      devtool: "source-map"
    }));
    await this.$ConvertHydrationEntryFile.mountWithWebpackCompiler(webpackCompiler);
    return webpackCompiler;
  };

  /**
   * 生产模式下的webpack配置
   * **/
  public async getWebpackProductionCompiler(): Promise<Compiler> {
    const basicConfig: Configuration = await this.getBasicConfig();
    const webpackCompiler = webpack(merge<Configuration>(basicConfig, {
      mode: "none",
      devtool: false
    }));
    await this.$ConvertHydrationEntryFile.mountWithWebpackCompiler(webpackCompiler);
    return webpackCompiler;
  };

};

IOCContainer.bind(HydrationConfigManager).toSelf().inRequestScope();