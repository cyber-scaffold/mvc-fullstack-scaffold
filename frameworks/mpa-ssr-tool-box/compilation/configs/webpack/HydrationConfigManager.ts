import path from "path";
import WebpackBar from "webpackbar";
import { merge } from "webpack-merge";
import { injectable, inject } from "inversify";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
import { webpack, DllReferencePlugin, SourceMapDevToolPlugin, DefinePlugin } from "webpack";

import { IOCContainer } from "@/frameworks/mpa-ssr-tool-box/compilation/cores/IOCContainer";
import { CompilationConfigManager } from "@/frameworks/mpa-ssr-tool-box/compilation/commons/CompilationConfigManager";

import { CompilationMaterielResourceDatabaseManager } from "@/frameworks/mpa-ssr-tool-box/compilation/commons/CompilationMaterielResourceDatabaseManager";
import { ScriptLoaderConfigManger } from "@/frameworks/mpa-ssr-tool-box/compilation/configs/loaders/ScriptLoaderConfigManger";
import { FileLoaderConfigManager } from "@/frameworks/mpa-ssr-tool-box/compilation/configs/loaders/FileLoaderConfigManager";
import { LessLoaderConfigManager } from "@/frameworks/mpa-ssr-tool-box/compilation/configs/loaders/LessLoaderConfigManager";
import { SassLoaderConfigManager } from "@/frameworks/mpa-ssr-tool-box/compilation/configs/loaders/SassLoaderConfigManager";
import { CssLoaderConfigManager } from "@/frameworks/mpa-ssr-tool-box/compilation/configs/loaders/CssLoaderConfigManager";

import { ConvertHydrationEntryFile } from "@/frameworks/mpa-ssr-tool-box/compilation/services/ConvertHydrationEntryFile";
import { CompilerProgressPlugin } from "@/frameworks/mpa-ssr-tool-box/compilation/plugins/CompilerProgressPlugin";

import type { PathData, Compiler, Configuration } from "webpack";

@injectable()
export class HydrationConfigManager {

  constructor (
    @inject(CompilationMaterielResourceDatabaseManager) private readonly $CompilationMaterielResourceDatabaseManager: CompilationMaterielResourceDatabaseManager,
    @inject(ConvertHydrationEntryFile) private readonly $ConvertHydrationEntryFile: ConvertHydrationEntryFile,
    @inject(ScriptLoaderConfigManger) private readonly $ScriptLoaderConfigManger: ScriptLoaderConfigManger,
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
    const { projectDirectoryPath, extractResourceDirectoryName, hydrationResourceDirectoryPath } = await this.$CompilationConfigManager.getRuntimeConfig();
    return {
      entry: this.$ConvertHydrationEntryFile.getWebpackEntryPoints(),
      output: {
        clean: true,
        path: hydrationResourceDirectoryPath,
        devtoolModuleFilenameTemplate: "[absolute-resource-path]",
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
          this.$FileLoaderConfigManager.getConfigByHydration(),
          this.$ScriptLoaderConfigManger.getLoaderConfig(),
          this.$LessLoaderConfigManager.getLoaderConfig(),
          this.$SassLoaderConfigManager.getLoaderConfig(),
          this.$CssLoaderConfigManager.getLoaderConfig()
        ])).flat()
      },
      plugins: [
        new WebpackBar({ name: "制作注水物料" }),
        // new NodePolyfillPlugin(),
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
          filename: (pathData: PathData) => `../${extractResourceDirectoryName}/index-${pathData.chunk.name}-hydration-[contenthash].css`
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
      devtool: false,
      plugins: [
        new SourceMapDevToolPlugin({
          test: /\.(js|css|less|scss|sass)($|\?)/i,
          filename: `../prod-source-maps/[base].map`, // 这里的 [file] 是指原文件名（如 main.js 或 main.css）
          // append: "\n//# sourceMappingURL=http://your-server.com/maps/[url]"
          // append为false的时候等价于hidden-source-map
          append: false
        })
      ]
    }));
    await this.$ConvertHydrationEntryFile.mountWithWebpackCompiler(webpackCompiler);
    return webpackCompiler;
  };

};

IOCContainer.bind(HydrationConfigManager).toSelf().inRequestScope();