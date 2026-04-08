import WebpackBar from "webpackbar";
import { merge } from "webpack-merge";
import { injectable, inject } from "inversify";
import { DefinePlugin, Configuration } from "webpack";
import VirtualModulesPlugin from "webpack-virtual-modules";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";

import { IOCContainer } from "@/library/commons/IOCContainer";
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
    const { hydrationResourceDirectoryPath, projectDirectoryPath } = await this.$RuntimeConfigManager.getRuntimeConfig();
    return {
      entry: "./main/hydration/virtual/entry.js",
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
          "@": projectDirectoryPath
        }
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
        new CompilerProgressPlugin({
          alias,
          type: "hydration",
          materielResourceDatabaseManager: this.$MaterielResourceDatabaseManager
        }),
        new VirtualModulesPlugin({
          "./main/hydration/virtual/entry.js": `
            import React from "react";
            import {createRoot} from "react-dom/client";
            import RenderElement from "${sourceCodeFilePath}";

            export default function (target,content){
              let rootElement;
              if(typeof target == "string"){
                rootElement=document.getElementById(target);
              } else {
                rootElement=target;
              };
              const ApplicationElement=React.createElement(RenderElement,content);
              return createRoot(rootElement).render(ApplicationElement);
              // createRoot(rootElement).render(<RenderElement {...content}/>);
            };
          `
        }),
        new WebpackBar({ name: "制作注水物料" }),
        new DefinePlugin({
          "process.TYPE": JSON.stringify("hydration"),
          "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
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