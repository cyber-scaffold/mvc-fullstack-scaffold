import { injectable, inject } from "inversify";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

import { IOCContainer } from "@/frameworks/mpa-ssr-tool-box/compilation/cores/IOCContainer";
import { CompilationConfigManager } from "@/frameworks/mpa-ssr-tool-box/compilation/commons/CompilationConfigManager";

import { filePathContentHash } from "@/frameworks/mpa-ssr-tool-box/compilation/utils/filePathContentHash";

@injectable()
export class LessLoaderConfigManager {

  constructor (
    @inject(CompilationConfigManager) private readonly $CompilationConfigManager: CompilationConfigManager
  ) { };

  /**
   * 对于node_modules中的模块而言
   * 让css-module缺省即可
   * **/
  private async getNodeModulesRules() {
    const { extractResourceDirectoryName } = this.$CompilationConfigManager.getRuntimeConfig();
    return [{
      loader: MiniCssExtractPlugin.loader,
      options: {
        emit: true,
        defaultExport: true,
        publicPath: `/${extractResourceDirectoryName}/`
      }
    }, {
      loader: "css-loader",
      options: {
        url: true,
        import: true,
        modules: false,
        esModule: false,
        sourceMap: true
      }
    }, {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          config: true
        },
        sourceMap: true
      }
    }, {
      loader: "less-loader",
      options: {
        lessOptions: {
          javascriptEnabled: true,
        },
        implementation: require("less"),
        sourceMap: true
      }
    }];
  };

  /**
   * 对于其余的项目文件
   * css-module需要开启
   * **/
  private async getProjectRules() {
    const { extractResourceDirectoryName } = this.$CompilationConfigManager.getRuntimeConfig();
    return [{
      loader: MiniCssExtractPlugin.loader,
      options: {
        emit: true,
        defaultExport: true,
        publicPath: `/${extractResourceDirectoryName}/`
      }
    }, {
      loader: "css-loader",
      options: {
        url: true,
        import: true,
        modules: {
          auto: true,
          exportOnlyLocals: false,
        },
        esModule: false,
        sourceMap: true
      }
    }, {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          config: true
        },
        sourceMap: true
      }
    }, {
      loader: "less-loader",
      options: {
        lessOptions: {
          javascriptEnabled: true,
        },
        implementation: require("less"),
        sourceMap: true
      }
    }]
  };

  public async getLoaderConfig() {
    return [{
      test: /\.(less)$/,
      oneOf: [{
        include: /(node_modules)/,
        use: await this.getNodeModulesRules()
      }, {
        use: await this.getProjectRules()
      }]
    }];
  };

};

IOCContainer.bind(LessLoaderConfigManager).toSelf().inSingletonScope();