import { injectable, inject } from "inversify";

import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";
import { IOCContainer } from "@/frameworks/commons/IOCContainer";

@injectable()
export class FileLoaderConfigManager {

  constructor(
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager
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