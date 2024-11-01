import { injectable, inject } from "inversify";

import { ApplicationConfigManager } from "@/frameworks/configs/ApplicationConfigManager";
import { IOCContainer } from "@/frameworks/configs/IOCContainer";

@injectable()
export class FileLoaderConfigManager {

  constructor(
    @inject(ApplicationConfigManager) private readonly $ApplicationConfigManager: ApplicationConfigManager
  ) { };

  public async getClientSiderLoaderConfig() {
    const hash = this.$ApplicationConfigManager.getRuntimeConfig();
    return [{
      test: /\.(ico|png|jpg|jpeg|gif|mp3|mp4|avi|svg|ttf|eot|otf|fon|ttc|woff|woff2)$/,
      use: [{
        loader: "file-loader",
        options: {
          emitFile: true,
          outputPath: "files",
          publicPath: "/files/",
          name: `[name]${hash ? ".[fullhash]" : ""}.[ext]`
        }
      }]
    }]
  };

  public async getServerSiderLoaderConfig() {
    const hash = this.$ApplicationConfigManager.getRuntimeConfig();
    return [{
      test: /\.(ico|png|jpg|jpeg|gif|mp3|mp4|avi|svg|ttf|eot|otf|fon|ttc|woff|woff2)$/,
      use: [{
        loader: "file-loader",
        options: {
          emitFile: true,
          outputPath: "files",
          publicPath: "/files/",
          name: `[name]${hash ? ".[fullhash]" : ""}.[ext]`
        }
      }]
    }]
  };

};

IOCContainer.bind(FileLoaderConfigManager).toSelf().inSingletonScope();