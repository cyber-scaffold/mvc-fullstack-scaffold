import fs from "fs";
import path from "path";
import webpack from "webpack";
import { promisify } from "util";
import WebpackBar from "webpackbar";
import { merge } from "webpack-merge";
import { injectable, inject } from "inversify";
import nodeExternals from "webpack-node-externals";
import CopyWebpackPlugin from "copy-webpack-plugin";

import { IOCContainer } from "@/frameworks/cores/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";
import { TypeScriptLoaderConfigManger } from "@/frameworks/configs/loaders/TypeScriptLoaderConfigManger";

import { VirtualFileWithUnionFileSystem } from "@/frameworks/services/VirtualFileWithUnionFileSystem";

import type { Configuration, Compiler } from "webpack";

@injectable()
export class ServerSiderConfigManager {

  private async getVirtualEntryFileAndReplaceContent() {
    const { entryFile } = this.$FrameworkConfigManager.getRuntimeConfig();
    const originContent = await promisify(fs.readFile)(path.resolve(__dirname, "../../templates/virtualEntryFile.template"), "utf-8");
    const replacedContent = originContent.replace("$$REAL_ENTRY_FILE_FULL_PATH$$", entryFile);
    return replacedContent;
  };

  constructor (
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager,
    @inject(TypeScriptLoaderConfigManger) private readonly $TypeScriptLoaderConfigManger: TypeScriptLoaderConfigManger,
    @inject(VirtualFileWithUnionFileSystem) private readonly $VirtualFileWithUnionFileSystem: VirtualFileWithUnionFileSystem
  ) { };

  /**
   * 最基础的webpack编译配置
   * **/
  public async getBasicConfig(): Promise<Configuration> {
    const {
      projectDirectoryPath,
      staticResourceDirectorySourcePath,
      staticResourceDirectoryDestinationPath,
      swaggerResourceDirectorySourcePath,
      swaggerResourceDirectoryDestinationPath,
    } = this.$FrameworkConfigManager.getRuntimeConfig();
    return {
      entry: [
        "esbuild-register",
        "source-map-support/register",
        this.$VirtualFileWithUnionFileSystem.getEntryFileVirtualPath()
      ],
      target: "node",
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
    const basicConfig: any = await this.getBasicConfig();
    const { assetsDirectoryPath } = this.$FrameworkConfigManager.getRuntimeConfig();
    const webpackCompiler = webpack(merge<Configuration>(basicConfig, {
      devtool: "source-map",
      mode: "development",
      output: {
        path: assetsDirectoryPath,
        filename: "server.js",
      },
    }));
    await this.$VirtualFileWithUnionFileSystem.initialize(webpackCompiler);
    const content = await this.getVirtualEntryFileAndReplaceContent();
    await this.$VirtualFileWithUnionFileSystem.generateEntryFileContent(content);
    return webpackCompiler;
  };

  /**
   * 生产模式下的webpack配置
   * **/
  public async getWebpackProductionCompiler(): Promise<Compiler> {
    const basicConfig: any = await this.getBasicConfig();
    const { assetsDirectoryPath } = this.$FrameworkConfigManager.getRuntimeConfig();
    const webpackCompiler = webpack(merge<Configuration>(basicConfig, {
      mode: "none",
      devtool: "source-map",
      output: {
        path: assetsDirectoryPath,
        filename: "server.js",
      },
    }));
    await this.$VirtualFileWithUnionFileSystem.initialize(webpackCompiler);
    const content = await this.getVirtualEntryFileAndReplaceContent();
    await this.$VirtualFileWithUnionFileSystem.generateEntryFileContent(content);
    return webpackCompiler;
  };

};

IOCContainer.bind(ServerSiderConfigManager).toSelf().inSingletonScope();



// externals: [{
//   "less": "commonjs less",
//   "express": "commonjs express",
//   "less-node": "commonjs less-node",
//   "webpack": "commonjs webpack",
//   "webpackbar": "commonjs webpackbar",
//   "webpack-merge": "commonjs webpack-merge",
//   "copy-webpack-plugin": "commonjs copy-webpack-plugin",
//   "terser-webpack-plugin": "commonjs terser-webpack-plugin",
//   "webpack-node-externals": "commonjs webpack-node-externals",
//   "webpack-assets-manifest": "commonjs webpack-assets-manifest",
//   "mini-css-extract-plugin": "commonjs mini-css-extract-plugin",
//   "node-polyfill-webpack-plugin": "commonjs node-polyfill-webpack-plugin",
//   "react": "commonjs react",
//   "react-dom": "commonjs react-dom",
//   "inversify": "commonjs inversify",
//   "typeorm": "commonjs typeorm",
//   "mongodb": "commonjs mongodb",
//   "amqplib": "commonjs amqplib",
//   "redis": "commonjs redis",
//   "knex": "commonjs knex"
// }],