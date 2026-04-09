import path from "path";
import WebpackBar from "webpackbar";
import { merge } from "webpack-merge";
import { injectable, inject } from "inversify";
import VirtualModulesPlugin from "webpack-virtual-modules";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
import { DllReferencePlugin, DefinePlugin, Configuration } from "webpack";

import { IOCContainer } from "@/library/cores/IOCContainer";
import { RuntimeConfigManager } from "@/library/commons/RuntimeConfigManager";

import { MaterielResourceDatabaseManager } from "@/library/commons/MaterielResourceDatabaseManager";
import { CssLoaderConfigManager } from "@/library/configs/loaders/CssLoaderConfigManager";
import { FileLoaderConfigManager } from "@/library/configs/loaders/FileLoaderConfigManager";
import { LessLoaderConfigManager } from "@/library/configs/loaders/LessLoaderConfigManager";
import { SassLoaderConfigManager } from "@/library/configs/loaders/SassLoaderConfigManager";
import { ESBuildLoaderConfigManger } from "@/library/configs/loaders/ESBuildLoaderConfigManger";
import { TypeScriptLoaderConfigManger } from "@/library/configs/loaders/TypeScriptLoaderConfigManger";

import { CompilerProgressPlugin } from "@/library/utils/CompilerProgressPlugin";
import { filePathContentHash } from "@/library/utils/filePathContentHash";


@injectable()
export class HydrationConfigManager {

  constructor (
    @inject(MaterielResourceDatabaseManager) private readonly $MaterielResourceDatabaseManager: MaterielResourceDatabaseManager,
    @inject(TypeScriptLoaderConfigManger) private readonly $TypeScriptLoaderConfigManger: TypeScriptLoaderConfigManger,
    @inject(ESBuildLoaderConfigManger) private readonly $ESBuildLoaderConfigManger: ESBuildLoaderConfigManger,
    @inject(FileLoaderConfigManager) private readonly $FileLoaderConfigManager: FileLoaderConfigManager,
    @inject(LessLoaderConfigManager) private readonly $LessLoaderConfigManager: LessLoaderConfigManager,
    @inject(SassLoaderConfigManager) private readonly $SassLoaderConfigManager: SassLoaderConfigManager,
    @inject(CssLoaderConfigManager) private readonly $CssLoaderConfigManager: CssLoaderConfigManager,
    @inject(RuntimeConfigManager) private readonly $RuntimeConfigManager: RuntimeConfigManager
  ) { };

  /**
   * 最基础的webpack编译配置
   * **/
  public async getBasicConfig(params) {
    const { alias, sourceCodeFilePath } = params;
    const { hydrationResourceDirectoryPath, projectDirectoryPath, assetsDirectoryPath } = await this.$RuntimeConfigManager.getRuntimeConfig();
    return {
      entry: [
        "./main/hydration/virtual/initial.css",
        "./main/hydration/virtual/entry.js"
      ],
      output: {
        path: hydrationResourceDirectoryPath,
        filename: () => `index-${filePathContentHash(sourceCodeFilePath)}-hydration-[contenthash].js`,
        // library: {
        //   name: "renderHydration",
        //   type: "window",
        //   export: "default"
        // }
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
        new NodePolyfillPlugin(),
        // new DllReferencePlugin({
        //   manifest: path.resolve(assetsDirectoryPath, "./dll/hydration.dll.json")
        // }),
        new CompilerProgressPlugin({
          alias,
          type: "hydration",
          materielResourceDatabaseManager: this.$MaterielResourceDatabaseManager
        }),
        new VirtualModulesPlugin({
          "./main/hydration/virtual/initial.css": [
            `* {padding:0;margin:0;}`
          ].join(),
          "./main/hydration/virtual/entry.js": `

            import React from "react";
            import {createRoot} from "react-dom/client";
            import RenderElement from "${sourceCodeFilePath}";

            function bootstrap(){
              var rootElement;
              if(typeof window._ROOT_ELEMENT_ == "string"){
                rootElement=document.getElementById(window._ROOT_ELEMENT_);
              } else {
                rootElement=window._ROOT_ELEMENT_;
              };
              var ApplicationElement=React.createElement(RenderElement,window._CONTENT_FROM_SERVER_);
              window._APPLICATION_MOUNT_ELEMENT_=createRoot(rootElement).render(ApplicationElement);
            }; bootstrap();
          `
        }),
        new WebpackBar({ name: "制作注水物料" }),
        new DefinePlugin({
          "process.env.RESOURCE_TYPE": JSON.stringify("hydration"),
          "process.env.NODE_ENV": "window._INJECT_RUNTIME_FROM_SERVER_.env.NODE_ENV"
        }),
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
  public async getDevelopmentConfig(params) {
    const { alias, sourceCodeFilePath } = params;
    const basicConfig: any = await this.getBasicConfig({ alias, sourceCodeFilePath });
    return merge<Configuration>(basicConfig, {
      mode: "development",
      devtool: "source-map"
    });
  };

  /**
   * 生产模式下的webpack配置
   * **/
  public async getProductionConfig(params) {
    const { alias, sourceCodeFilePath } = params;
    const basicConfig: any = await this.getBasicConfig({ alias, sourceCodeFilePath });
    return merge<Configuration>(basicConfig, {
      mode: "none",
      devtool: false
    });
  };

};

IOCContainer.bind(HydrationConfigManager).toSelf().inRequestScope();