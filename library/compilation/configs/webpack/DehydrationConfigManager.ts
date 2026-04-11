import path from "path";
import { webpack } from "webpack";
import WebpackBar from "webpackbar";
import { merge } from "webpack-merge";
import { injectable, inject } from "inversify";
import nodeExternals from "webpack-node-externals";
import { DefinePlugin, Configuration } from "webpack";

import { IOCContainer } from "@/library/compilation/cores/IOCContainer";
import { CompilationConfigManager } from "@/library/compilation/commons/CompilationConfigManager";

import { CompilationMaterielResourceDatabaseManager } from "@/library/compilation/commons/CompilationMaterielResourceDatabaseManager";
import { TypeScriptLoaderConfigManger } from "@/library/compilation/configs/loaders/TypeScriptLoaderConfigManger";
import { ESBuildLoaderConfigManger } from "@/library/compilation/configs/loaders/ESBuildLoaderConfigManger";
import { FileLoaderConfigManager } from "@/library/compilation/configs/loaders/FileLoaderConfigManager";
import { LessLoaderConfigManager } from "@/library/compilation/configs/loaders/LessLoaderConfigManager";
import { SassLoaderConfigManager } from "@/library/compilation/configs/loaders/SassLoaderConfigManager";
import { CssLoaderConfigManager } from "@/library/compilation/configs/loaders/CssLoaderConfigManager";

import { DehydrationEntryVirtualFile } from "@/library/compilation/services/DehydrationEntryVirtualFile";
import { CompilerProgressPlugin } from "@/library/compilation/utils/CompilerProgressPlugin";
import { filePathContentHash } from "@/library/public/filePathContentHash";

import type { Compiler } from "webpack";

/**
 * 脱水化资源的编译选项管理器
 * **/
@injectable()
export class DehydrationConfigManager {

  constructor (
    @inject(CompilationMaterielResourceDatabaseManager) private readonly $CompilationMaterielResourceDatabaseManager: CompilationMaterielResourceDatabaseManager,
    @inject(DehydrationEntryVirtualFile) private readonly $DehydrationEntryVirtualFile: DehydrationEntryVirtualFile,
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
  public async getBasicConfig(params) {
    const { alias } = params;
    const { projectDirectoryPath } = this.$CompilationConfigManager.getRuntimeConfig();
    return {
      entry: [
        "source-map-support/register",
        ...this.$DehydrationEntryVirtualFile.getVirtualFilePathList()
      ],
      target: "node",
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
          this.$TypeScriptLoaderConfigManger.getDehydrationSiderLoaderConfig(),
          this.$ESBuildLoaderConfigManger.getDehydrationSiderLoaderConfig(),
          this.$FileLoaderConfigManager.getDehydrationSiderLoaderConfig(),
          this.$LessLoaderConfigManager.getDehydrationSiderLoaderConfig(),
          this.$SassLoaderConfigManager.getDehydrationSiderLoaderConfig(),
          this.$CssLoaderConfigManager.getDehydrationSiderLoaderConfig()
        ])).flat()
      },
      plugins: [
        new WebpackBar({ name: "制作脱水物料" }),
        new CompilerProgressPlugin({
          alias,
          type: "dehydration",
          materielResourceDatabaseManager: this.$CompilationMaterielResourceDatabaseManager
        }),
        new DefinePlugin({
          "process.env.RESOURCE_TYPE": JSON.stringify("dehydration")
        })
      ]
    };
  };

  /**
   * 开发模式下的webpack配置
   * **/
  public async getWebpackDevelopmentCompiler(params): Promise<Compiler> {
    const { alias, sourceCodeFilePath } = params;
    const basicConfig: Configuration = await this.getBasicConfig({ alias, sourceCodeFilePath });
    const { dehydrationResourceDirectoryPath } = this.$CompilationConfigManager.getRuntimeConfig();
    const webpackCompiler = webpack(merge<Configuration>(basicConfig, {
      mode: "development",
      devtool: "source-map",
      output: {
        path: dehydrationResourceDirectoryPath,
        filename: () => {
          return `index-${filePathContentHash(sourceCodeFilePath)}-dehydration-[contenthash].js`;
        },
        library: {
          type: "commonjs2"
        }
      },
    }));
    await this.$DehydrationEntryVirtualFile.initialize(webpackCompiler);
    await this.$DehydrationEntryVirtualFile.generateEntryFileContent(sourceCodeFilePath);
    return webpackCompiler;
  };

  /**
   * 生产模式下的webpack配置
   * **/
  public async getWebpackProductionCompiler(params): Promise<Compiler> {
    const { alias, sourceCodeFilePath } = params;
    const basicConfig: Configuration = await this.getBasicConfig({ alias, sourceCodeFilePath });
    const { dehydrationResourceDirectoryPath } = this.$CompilationConfigManager.getRuntimeConfig();
    const webpackCompiler = webpack(merge<Configuration>(basicConfig, {
      devtool: "source-map",
      mode: "none",
      output: {
        path: dehydrationResourceDirectoryPath,
        filename: () => {
          return `index-${filePathContentHash(sourceCodeFilePath)}-dehydration-[contenthash].js`;
        },
        library: {
          type: "commonjs2"
        }
      },
    }));
    await this.$DehydrationEntryVirtualFile.initialize(webpackCompiler);
    await this.$DehydrationEntryVirtualFile.generateEntryFileContent(sourceCodeFilePath);
    return webpackCompiler;
  };

};

IOCContainer.bind(DehydrationConfigManager).toSelf().inRequestScope();