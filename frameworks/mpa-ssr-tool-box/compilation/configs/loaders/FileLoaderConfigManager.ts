import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/mpa-ssr-tool-box/compilation/cores/IOCContainer";
import { CompilationConfigManager } from "@/frameworks/mpa-ssr-tool-box/compilation/commons/CompilationConfigManager";

import type { MaterielCompilationInfoType } from "@/frameworks/mpa-ssr-tool-box/compilation/commons/CompilationConfigManager";

/**
 * 这个类必须为单例模式
 * 因为当注水资源和脱水资源同时都需要构建的时候需要计算哪些资源不需要重复生成
 * **/
@injectable()
export class FileLoaderConfigManager {

  static computedEmitFile(materielArrayList: MaterielCompilationInfoType[]) {
    const emitMemberList = [];
    const noEmitMemberList = [];
    materielArrayList.forEach((everyMateriel: MaterielCompilationInfoType) => {
      if (everyMateriel.hydrate) { };
    });
  };

  constructor (
    @inject(CompilationConfigManager) private readonly $CompilationConfigManager: CompilationConfigManager
  ) { };

  private async getNodeModulesRules() {
    const { materielArrayList, extractResourceDirectoryName } = this.$CompilationConfigManager.getRuntimeConfig();
    return [{
      loader: "file-loader",
      options: {
        emitFile: true,
        outputPath: `../${extractResourceDirectoryName}/`,
        publicPath: `/${extractResourceDirectoryName}/`,
        name: (resourcePath: string) => {
          return `[name]-[contenthash].[ext]`;
        }
      }
    }];
  };

  private async getProjectRules() {
    const { materielArrayList, extractResourceDirectoryName } = this.$CompilationConfigManager.getRuntimeConfig();
    return [{
      loader: "file-loader",
      options: {
        emitFile: true,
        outputPath: `../${extractResourceDirectoryName}/`,
        publicPath: `/${extractResourceDirectoryName}/`,
        name: (resourcePath: string) => {
          return `[name]-[contenthash].[ext]`;
        }
      }
    }];
  };

  public async getLoaderConfig() {
    return [{
      test: /\.(ico|png|jpg|jpeg|gif|mp3|mp4|avi|svg|ttf|eot|otf|fon|ttc|woff|woff2)$/,
      oneOf: [{
        include: /(node_modules)/,
        use: await this.getNodeModulesRules()
      }, {
        // include: [],
        use: await this.getProjectRules()
      }]
    }]
  };

};

IOCContainer.bind(FileLoaderConfigManager).toSelf().inSingletonScope();