import path from "path";
import WebpackBar from "webpackbar";
import { merge } from "webpack-merge";
import { injectable, inject } from "inversify";
import nodeExternals from "webpack-node-externals";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { webpack, DefinePlugin, Configuration } from "webpack";

import { IOCContainer } from "@/frameworks/mpa-ssr-tool-box/compilation/cores/IOCContainer";
import { CompilationConfigManager } from "@/frameworks/mpa-ssr-tool-box/compilation/commons/CompilationConfigManager";

import { CompilationMaterielResourceDatabaseManager } from "@/frameworks/mpa-ssr-tool-box/compilation/commons/CompilationMaterielResourceDatabaseManager";
import { ScriptLoaderConfigManger } from "@/frameworks/mpa-ssr-tool-box/compilation/configs/loaders/ScriptLoaderConfigManger";
import { FileLoaderConfigManager } from "@/frameworks/mpa-ssr-tool-box/compilation/configs/loaders/FileLoaderConfigManager";
import { LessLoaderConfigManager } from "@/frameworks/mpa-ssr-tool-box/compilation/configs/loaders/LessLoaderConfigManager";
import { SassLoaderConfigManager } from "@/frameworks/mpa-ssr-tool-box/compilation/configs/loaders/SassLoaderConfigManager";
import { CssLoaderConfigManager } from "@/frameworks/mpa-ssr-tool-box/compilation/configs/loaders/CssLoaderConfigManager";

import { ConvertDehydrationEntryFile } from "@/frameworks/mpa-ssr-tool-box/compilation/services/ConvertDehydrationEntryFile";
import { CompilerProgressPlugin } from "@/frameworks/mpa-ssr-tool-box/compilation/plugins/CompilerProgressPlugin";

import type { PathData, Compiler } from "webpack";

/**
 * 脱水化资源的编译选项管理器
 * **/
@injectable()
export class DehydrationConfigManager {

  constructor (
    @inject(CompilationMaterielResourceDatabaseManager) private readonly $CompilationMaterielResourceDatabaseManager: CompilationMaterielResourceDatabaseManager,
    @inject(ConvertDehydrationEntryFile) private readonly $ConvertDehydrationEntryFile: ConvertDehydrationEntryFile,
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
    const { projectDirectoryPath, extractResourceDirectoryName, dehydrationResourceDirectoryPath } = this.$CompilationConfigManager.getRuntimeConfig();
    return {
      entry: this.$ConvertDehydrationEntryFile.getWebpackEntryPoints(),
      target: "node",
      output: {
        clean: true,
        path: dehydrationResourceDirectoryPath,
        filename: (pathData: PathData) => `index-${pathData.chunk.name}-dehydration-[contenthash].js`,
        library: {
          type: "commonjs"
        }
      },
      resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
        alias: {
          "@": projectDirectoryPath
        }
      },
      // node: {
      //   global: true,
      //   __dirname: true,
      //   __filename: true
      // },
      externalsPresets: { node: true },
      externals: [nodeExternals({
        modulesFromFile: path.resolve(projectDirectoryPath, "./package.json")
      })],
      module: {
        rules: (await Promise.all([
          this.$FileLoaderConfigManager.getConfigByDehydration(),
          this.$ScriptLoaderConfigManger.getLoaderConfig(),
          this.$LessLoaderConfigManager.getLoaderConfig(),
          this.$SassLoaderConfigManager.getLoaderConfig(),
          this.$CssLoaderConfigManager.getLoaderConfig()
        ])).flat()
      },
      plugins: [
        new WebpackBar({ name: "制作脱水物料" }),
        new CompilerProgressPlugin({
          type: "dehydration",
          materielResourceDatabaseManager: this.$CompilationMaterielResourceDatabaseManager
        }),
        new DefinePlugin({
          "process.env.RESOURCE_TYPE": JSON.stringify("dehydration")
        }),
        new MiniCssExtractPlugin({
          runtime: false,
          linkType: false,
          filename: (pathData: PathData) => `../${extractResourceDirectoryName}/index-${pathData.chunk.name}-dehydration-[contenthash].css`
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
    await this.$ConvertDehydrationEntryFile.mountWithWebpackCompiler(webpackCompiler);
    return webpackCompiler;
  };

  /**
   * 生产模式下的webpack配置
   * **/
  public async getWebpackProductionCompiler(): Promise<Compiler> {
    const basicConfig: Configuration = await this.getBasicConfig();
    const webpackCompiler = webpack(merge<Configuration>(basicConfig, {
      mode: "none",
      devtool: "source-map"
    }));
    await this.$ConvertDehydrationEntryFile.mountWithWebpackCompiler(webpackCompiler);
    return webpackCompiler;
  };

};

IOCContainer.bind(DehydrationConfigManager).toSelf().inRequestScope();