import { injectable, inject } from "inversify";

import { IOCContainer } from "@/library/compilation/cores/IOCContainer";
import { CompilationConfigManager } from "@/library/compilation/commons/CompilationConfigManager";

import { filePathContentHash } from "@/library/public/filePathContentHash";

@injectable()
export class FileLoaderConfigManager {

  constructor (
    @inject(CompilationConfigManager) private readonly $CompilationConfigManager: CompilationConfigManager
  ) { };

  public async getHydrationSiderLoaderConfig() {
    const { fileResourceDirectoryName } = this.$CompilationConfigManager.getRuntimeConfig();
    return [{
      test: /\.(ico|png|jpg|jpeg|gif|mp3|mp4|avi|svg|ttf|eot|otf|fon|ttc|woff|woff2)$/,
      use: [{
        loader: "file-loader",
        options: {
          emitFile: true,
          outputPath: `../${fileResourceDirectoryName}/`,
          publicPath: `/${fileResourceDirectoryName}/`,
          name: (resourcePath: string) => {
            return `[name]-${filePathContentHash(resourcePath)}-[contenthash].[ext]`;
          }
        }
      }]
    }]
  };

  public async getDehydrationSiderLoaderConfig() {
    const { fileResourceDirectoryName } = this.$CompilationConfigManager.getRuntimeConfig();
    return [{
      test: /\.(ico|png|jpg|jpeg|gif|mp3|mp4|avi|svg|ttf|eot|otf|fon|ttc|woff|woff2)$/,
      use: [{
        loader: "file-loader",
        options: {
          emitFile: true,
          outputPath: `../${fileResourceDirectoryName}/`,
          publicPath: `/${fileResourceDirectoryName}/`,
          name: (resourcePath: string) => {
            return `[name]-${filePathContentHash(resourcePath)}-[contenthash].[ext]`;
          }
        }
      }]
    }]
  };

};

IOCContainer.bind(FileLoaderConfigManager).toSelf().inSingletonScope();