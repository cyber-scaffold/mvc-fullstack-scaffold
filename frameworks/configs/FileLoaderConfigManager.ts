import os from "os";
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
      }, {
        loader: "thread-loader",
        options: {
          workers: os.cpus().length - 1,
          workerParallelJobs: 50,
          workerNodeArgs: ['--max-old-space-size=1024'],
          poolRespawn: false,
          poolTimeout: 2000,
          poolParallelJobs: 50,
        },
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
      }, {
        loader: "thread-loader",
        options: {
          workers: os.cpus().length - 1,
          workerParallelJobs: 50,
          workerNodeArgs: ['--max-old-space-size=1024'],
          poolRespawn: false,
          poolTimeout: 2000,
          poolParallelJobs: 50,
        },
      }]
    }]
  };

};

IOCContainer.bind(FileLoaderConfigManager).toSelf().inSingletonScope();