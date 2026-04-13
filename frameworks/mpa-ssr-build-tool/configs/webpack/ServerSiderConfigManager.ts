import path from "path";
import webpack from "webpack";
import WebpackBar from "webpackbar";
import { merge } from "webpack-merge";
import { injectable, inject } from "inversify";
import nodeExternals from "webpack-node-externals";
import CopyWebpackPlugin from "copy-webpack-plugin";

import { IOCContainer } from "@/frameworks/mpa-ssr-build-tool/cores/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/mpa-ssr-build-tool/commons/FrameworkConfigManager";
import { TypeScriptLoaderConfigManger } from "@/frameworks/mpa-ssr-build-tool/configs/loaders/TypeScriptLoaderConfigManger";

import { ServerProjectVirtualFile } from "@/frameworks/mpa-ssr-build-tool/services/ServerProjectVirtualFile";

import type { Configuration, Compiler } from "webpack";

@injectable()
export class ServerSiderConfigManager {

  constructor (
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager,
    @inject(TypeScriptLoaderConfigManger) private readonly $TypeScriptLoaderConfigManger: TypeScriptLoaderConfigManger,
    @inject(ServerProjectVirtualFile) private readonly $ServerProjectVirtualFile: ServerProjectVirtualFile
  ) { };

  /**
   * 最基础的webpack编译配置
   * **/
  public async getBasicConfig(): Promise<Configuration> {
    const {
      assetsDirectoryPath,
      projectDirectoryPath,
      staticResourceDirectorySourcePath,
      staticResourceDirectoryDestinationPath,
      swaggerInitializer,
      swaggerResourceDirectorySourcePath,
      swaggerResourceDirectoryDestinationPath,
    } = this.$FrameworkConfigManager.getRuntimeConfig();
    return {
      entry: this.$ServerProjectVirtualFile.getVirtualFilePathList(),
      target: "node",
      output: {
        path: assetsDirectoryPath,
        filename: "server.js",
      },
      resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
        alias: {
          "@": process.cwd()
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
          this.$TypeScriptLoaderConfigManger.getServerSiderLoaderConfig()
        ])).flat()
      },
      plugins: [
        new WebpackBar({ name: "编译主服务项目" }),
        new CopyWebpackPlugin({
          patterns: [{
            from: swaggerResourceDirectorySourcePath,
            to: swaggerResourceDirectoryDestinationPath
          }, {
            from: swaggerInitializer,
            to: swaggerResourceDirectoryDestinationPath
          }, {
            from: staticResourceDirectorySourcePath,
            to: staticResourceDirectoryDestinationPath
          }]
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
    await this.$ServerProjectVirtualFile.mountWithWebpackCompiler(webpackCompiler);
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
    await this.$ServerProjectVirtualFile.mountWithWebpackCompiler(webpackCompiler);
    return webpackCompiler;
  };

};

IOCContainer.bind(ServerSiderConfigManager).toSelf().inSingletonScope();