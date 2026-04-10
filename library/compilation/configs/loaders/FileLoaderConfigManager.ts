import { injectable, inject } from "inversify";

import { IOCContainer } from "@/library/compilation/cores/IOCContainer";
import { filePathContentHash } from "@/library/public/filePathContentHash";

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
          name: (resourcePath: string) => {
            return `[name]-${filePathContentHash(resourcePath)}-[contenthash].[ext]`;
          }
        }
      }]
    }]
  };

};

IOCContainer.bind(FileLoaderConfigManager).toSelf().inSingletonScope();