import { injectable, inject } from "inversify";

import { ApplicationConfigManager } from "@/frameworks/configs/ApplicationConfigManager";
import { IOCContainer } from "@/frameworks/configs/IOCContainer";

@injectable()
export class FileLoaderConfigManager {

  constructor(
    @inject(ApplicationConfigManager) private readonly $ApplicationConfigManager: ApplicationConfigManager
  ) { };

  public async getClientSiderLoaderConfig() {
    return [{
      test: /\.(ico|png|jpg|jpeg|gif|mp3|mp4|avi|svg|ttf|eot|otf|fon|ttc|woff|woff2)$/,
      use: [{
        loader: "file-loader",
        options: {
          emitFile: true,
          publicPath: "/files/",
          outputPath: "/files/",
          name: "[name]-[contenthash].[ext]"
        }
      }]
    }]
  };

  public async getServerSiderLoaderConfig() {
    return [{
      test: /\.(ico|png|jpg|jpeg|gif|mp3|mp4|avi|svg|ttf|eot|otf|fon|ttc|woff|woff2)$/,
      use: [{
        loader: "file-loader",
        options: {
          emitFile: false,
          publicPath: "/files/",
          outputPath: "/files/",
          name: "[name]-[contenthash].[ext]"
        }
      }]
    }]
  };

};

IOCContainer.bind(FileLoaderConfigManager).toSelf().inSingletonScope();