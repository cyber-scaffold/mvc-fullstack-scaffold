import path from "path";
import WebpackBar from "webpackbar";
import { merge } from "webpack-merge";
import { injectable, inject } from "inversify";
import { DefinePlugin, Configuration } from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";

import { IOCContainer } from "@/library/commons/IOCContainer";
import { FrameworkConfigManager } from "@/library/commons/FrameworkConfigManager";

import { CssLoaderConfigManager } from "@/library/configs/loaders/CssLoaderConfigManager";
import { FileLoaderConfigManager } from "@/library/configs/loaders/FileLoaderConfigManager";
import { LessLoaderConfigManager } from "@/library/configs/loaders/LessLoaderConfigManager";
import { SassLoaderConfigManager } from "@/library/configs/loaders/SassLoaderConfigManager";
import { ESBuildLoaderConfigManger } from "@/library/configs/loaders/ESBuildLoaderConfigManger";
import { TypeScriptLoaderConfigManger } from "@/library/configs/loaders/TypeScriptLoaderConfigManger";

import { filePathContentHash } from "@/library/utils/filePathContentHash";

@injectable()
export class HydrationConfigManager {

  constructor(
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager,
    @inject(TypeScriptLoaderConfigManger) private readonly $TypeScriptLoaderConfigManger: TypeScriptLoaderConfigManger,
    @inject(ESBuildLoaderConfigManger) private readonly $ESBuildLoaderConfigManger: ESBuildLoaderConfigManger,
    @inject(FileLoaderConfigManager) private readonly $FileLoaderConfigManager: FileLoaderConfigManager,
    @inject(LessLoaderConfigManager) private readonly $LessLoaderConfigManager: LessLoaderConfigManager,
    @inject(SassLoaderConfigManager) private readonly $SassLoaderConfigManager: SassLoaderConfigManager,
    @inject(CssLoaderConfigManager) private readonly $CssLoaderConfigManager: CssLoaderConfigManager,
  ) { };

  /**
   * 最基础的webpack编译配置
   * **/
  public async getBasicConfig(sourceCodeFilePath: string) {
    const { hydrationResourceDirectoryPath, projectDirectoryPath } = await this.$FrameworkConfigManager.getRuntimeConfig();
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
          "@@": path.resolve(projectDirectoryPath, "../"),
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
        new NodePolyfillPlugin(),
        new WebpackBar({ name: "制作注水物料" }),
        new DefinePlugin({ "process.TYPE": JSON.stringify("hydration") }),
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
    return merge<Configuration>(basicConfig, {
      mode: "none",
      devtool: false
    });
  };

};

IOCContainer.bind(HydrationConfigManager).toSelf().inRequestScope();