import { injectable, inject } from "inversify";

import { IOCContainer } from "@/library/commons/IOCContainer";
import { filePathContentHash } from "@/library/utils/filePathContentHash";

@injectable()
export class FileLoaderConfigManager {

  public async getHydrationSiderLoaderConfig() {
    return [{
      test: /\.(ico|png|jpg|jpeg|gif|mp3|mp4|avi|svg|ttf|eot|otf|fon|ttc|woff|woff2)$/,
      use: [{
        loader: "file-loader",
        options: {
          emitFile: true,
          publicPath: "/hydration/",
          // outputPath: "/hydration/",
          // name: "[name]-[contenthash].[ext]"
          name: (resourcePath: string) => {
            return `[name]-${filePathContentHash(resourcePath)}-[contenthash].[ext]`;
          }
        }
      }]
    }]
  };

  public async getDehydrationSiderLoaderConfig() {
    return [{
      test: /\.(ico|png|jpg|jpeg|gif|mp3|mp4|avi|svg|ttf|eot|otf|fon|ttc|woff|woff2)$/,
      use: [{
        loader: "file-loader",
        options: {
          emitFile: false,
          publicPath: "/hydration/",
          // outputPath: "/hydration/",
          name: (resourcePath: string) => {
            return `[name]-${filePathContentHash(resourcePath)}-[contenthash].[ext]`;
          }
        }
      }]
    }]
  };

};

IOCContainer.bind(FileLoaderConfigManager).toSelf().inSingletonScope();