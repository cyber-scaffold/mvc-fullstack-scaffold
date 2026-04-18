import path from "path";
import webpack from "webpack";
import WebpackBar from "webpackbar";
import { merge } from "webpack-merge";
import { injectable, inject } from "inversify";
import nodeExternals from "webpack-node-externals";
import CopyWebpackPlugin from "copy-webpack-plugin";

import { IOCContainer } from "@/frameworks/mpa-ssr-build-tool/cores/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/mpa-ssr-build-tool/commons/FrameworkConfigManager";
import { ScriptLoaderConfigManger } from "@/frameworks/mpa-ssr-build-tool/configs/loaders/ScriptLoaderConfigManger";

import { ServerProjectVirtualFile } from "@/frameworks/mpa-ssr-build-tool/services/ServerProjectVirtualFile";

import type { Configuration, Compiler } from "webpack";

@injectable()
export class ServerSiderConfigManager {

  constructor (
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager,
    @inject(ScriptLoaderConfigManger) private readonly $ScriptLoaderConfigManger: ScriptLoaderConfigManger,
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
      entry: this.$ServerProjectVirtualFile.getWebpackEntryPoints(),
      target: "node",
      output: {
        path: assetsDirectoryPath,
        filename: "server.js",
        devtoolModuleFilenameTemplate: "[absolute-resource-path]"
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
          this.$ScriptLoaderConfigManger.getLoaderConfig()
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
      /**
       * hidden-source-map只是在编译产物中不索引source-map
       * 但是source-map依然会生成,可以开启debug模式后在chrome中上传source-map进行调试
       * 然后source-map的源代码是可以指向git仓库中的源代码的,这意味着chrome可以从git仓库拉取源代码来打断点调试
       * **/
      devtool: "hidden-source-map",
      //output: {
      // 这里可以考虑使用git仓库的路径
      // devtoolModuleFilenameTemplate: "[resource-path]"
      //}
    }));
    await this.$ServerProjectVirtualFile.mountWithWebpackCompiler(webpackCompiler);
    return webpackCompiler;
  };

};

IOCContainer.bind(ServerSiderConfigManager).toSelf().inSingletonScope();