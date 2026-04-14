import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/mpa-ssr-tool-box/compilation/cores/IOCContainer";
import { CompilationConfigManager } from "@/frameworks/mpa-ssr-tool-box/compilation/commons/CompilationConfigManager";

@injectable()
export class FileLoaderConfigManager {

  constructor (
    @inject(CompilationConfigManager) private readonly $CompilationConfigManager: CompilationConfigManager
  ) { };

  public async getHydrationSiderLoaderConfig() {
    const { extractResourceDirectoryName } = this.$CompilationConfigManager.getRuntimeConfig();
    return [{
      test: /\.(ico|png|jpg|jpeg|gif|mp3|mp4|avi|svg|ttf|eot|otf|fon|ttc|woff|woff2)$/,
      use: [{
        loader: "file-loader",
        options: {
          emitFile: true,
          outputPath: `../${extractResourceDirectoryName}/`,
          publicPath: `/${extractResourceDirectoryName}/`,
          name: (resourcePath: string) => {
            return `[name]-hydration-[contenthash].[ext]`;
          }
        }
      }]
    }]
  };

  public async getDehydrationSiderLoaderConfig() {
    const { extractResourceDirectoryName } = this.$CompilationConfigManager.getRuntimeConfig();
    return [{
      test: /\.(ico|png|jpg|jpeg|gif|mp3|mp4|avi|svg|ttf|eot|otf|fon|ttc|woff|woff2)$/,
      use: [{
        loader: "file-loader",
        options: {
          emitFile: true,
          outputPath: `../${extractResourceDirectoryName}/`,
          publicPath: `/${extractResourceDirectoryName}/`,
          name: (resourcePath: string) => {
            return `[name]-dehydration-[contenthash].[ext]`;
          }
        }
      }]
    }]
  };

};

IOCContainer.bind(FileLoaderConfigManager).toSelf().inSingletonScope();