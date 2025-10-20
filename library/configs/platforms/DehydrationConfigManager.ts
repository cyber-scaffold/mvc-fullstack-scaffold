import path from "path";
import WebpackBar from "webpackbar";
import { merge } from "webpack-merge";
import { injectable, inject } from "inversify";
import nodeExternals from "webpack-node-externals";
import { DefinePlugin, Configuration } from "webpack";

import { IOCContainer } from "@/library/commons/IOCContainer";
import { FrameworkConfigManager } from "@/library/commons/FrameworkConfigManager";

import { TypeScriptLoaderConfigManger } from "@/library/configs/loaders/TypeScriptLoaderConfigManger";
import { BabelLoaderConfigManger } from "@/library/configs/loaders/BabelLoaderConfigManger";
import { FileLoaderConfigManager } from "@/library/configs/loaders/FileLoaderConfigManager";
import { LessLoaderConfigManager } from "@/library/configs/loaders/LessLoaderConfigManager";
import { SassLoaderConfigManager } from "@/library/configs/loaders/SassLoaderConfigManager";
import { CssLoaderConfigManager } from "@/library/configs/loaders/CssLoaderConfigManager";

import { filePathContentHash } from "@/library/utils/filePathContentHash";

/**
 * 脱水化资源的编译选项管理器
 * **/
@injectable()
export class DehydrationConfigManager {

  constructor(
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager,
    @inject(TypeScriptLoaderConfigManger) private readonly $TypeScriptLoaderConfigManger: TypeScriptLoaderConfigManger,
    @inject(BabelLoaderConfigManger) private readonly $BabelLoaderConfigManger: BabelLoaderConfigManger,
    @inject(FileLoaderConfigManager) private readonly $FileLoaderConfigManager: FileLoaderConfigManager,
    @inject(LessLoaderConfigManager) private readonly $LessLoaderConfigManager: LessLoaderConfigManager,
    @inject(SassLoaderConfigManager) private readonly $SassLoaderConfigManager: SassLoaderConfigManager,
    @inject(CssLoaderConfigManager) private readonly $CssLoaderConfigManager: CssLoaderConfigManager,
  ) { };

  /**
   * 最基础的webpack编译配置
   * **/
  public async getBasicConfig(sourceCodeFilePath: string) {
    return {
      entry: ["source-map-support/register", sourceCodeFilePath],
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
        new WebpackBar({ name: "编译脱水化渲染资源" })
      ]
    };
  };

  /**
 * 开发模式下的webpack配置
 * **/
  public async getDevelopmentConfig(sourceCodeFilePath: string) {
    const basicConfig: any = await this.getBasicConfig(sourceCodeFilePath);
    const { dehydrationResourceDirectoryPath } = this.$FrameworkConfigManager.getRuntimeConfig();
    return merge<Configuration>(basicConfig, {
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
    });
  };

  /**
   * 生产模式下的webpack配置
   * **/
  public async getProductionConfig(sourceCodeFilePath: string) {
    const basicConfig: any = await this.getBasicConfig(sourceCodeFilePath);
    const { dehydrationResourceDirectoryPath } = this.$FrameworkConfigManager.getRuntimeConfig();
    return merge<Configuration>(basicConfig, {
      mode: "production",
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
    });
  };

};

IOCContainer.bind(DehydrationConfigManager).toSelf().inRequestScope();