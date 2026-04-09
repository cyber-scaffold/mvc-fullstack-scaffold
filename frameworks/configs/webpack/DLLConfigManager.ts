import path from "path";
import WebpackBar from "webpackbar";
import { merge } from "webpack-merge";
import { injectable, inject } from "inversify";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { DllPlugin, DefinePlugin, Configuration } from "webpack";

import { IOCContainer } from "@/frameworks/cores/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";


import { TypeScriptLoaderConfigManger } from "@/frameworks/configs/loaders/TypeScriptLoaderConfigManger";
import { ESBuildLoaderConfigManger } from "@/frameworks/configs/loaders/ESBuildLoaderConfigManger";


@injectable()
export class DLLConfigManager {

  constructor (
    @inject(TypeScriptLoaderConfigManger) private readonly $TypeScriptLoaderConfigManger: TypeScriptLoaderConfigManger,
    @inject(ESBuildLoaderConfigManger) private readonly $ESBuildLoaderConfigManger: ESBuildLoaderConfigManger,
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager
  ) { };

  /**
   * 最基础的webpack编译配置
   * **/
  public async getBasicConfig() {
    const { assetsDirectoryPath } = await this.$FrameworkConfigManager.getRuntimeConfig();
    return {
      entry: {
        vendor: ["react", "react-dom/client", "moment", "lodash", "dot-prop", "axios"],
      },
      output: {
        path: path.resolve(assetsDirectoryPath, "./dll/"),
        filename: "hydration.dll.js",
        library: "hydrationDLLVendor"
      },
      resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
      },
      optimization: {
        nodeEnv: false
      },
      module: {
        rules: (await Promise.all([
          this.$TypeScriptLoaderConfigManger.getClientSiderLoaderConfig(),
          this.$ESBuildLoaderConfigManger.getClientSiderLoaderConfig()
        ])).flat()
      },
      plugins: [
        new WebpackBar({ name: "生成DLL动态链接库" }),
        new MiniCssExtractPlugin({
          linkType: "text/css",
          filename: "hydration.dll.css"
        }),
        new DefinePlugin({
          "process.env.NODE_ENV": "window._INJECT_RUNTIME_FROM_SERVER_.env.NODE_ENV"
        }),
        new DllPlugin({
          // 清单文件描述文件
          path: path.resolve(assetsDirectoryPath, "./dll/hydration.dll.json"),
          // 必须与 output.library 保持一致
          name: "hydrationDLLVendor"
        })
      ]
    };
  };

  /**
   * 开发模式下的webpack配置
   * **/
  public async getDevelopmentConfig() {
    const basicConfig: any = await this.getBasicConfig();
    return merge<Configuration>(basicConfig, {
      mode: "development",
      devtool: "source-map"
    });
  };

  /**
   * 生产模式下的webpack配置
   * **/
  public async getProductionConfig() {
    const basicConfig: any = await this.getBasicConfig();
    return merge<Configuration>(basicConfig, {
      mode: "development",
      devtool: false
    });
  };

};

IOCContainer.bind(DLLConfigManager).toSelf().inRequestScope();