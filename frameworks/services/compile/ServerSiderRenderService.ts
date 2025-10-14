import { webpack } from "webpack";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/commons/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";

import { ServerSiderConfigManager } from "@/frameworks/configs/platforms/ServerSiderConfigManager";

@injectable()
export class ServerSiderRenderService {

  constructor(
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager,
    @inject(ServerSiderConfigManager) private readonly $ServerSiderConfigManager: ServerSiderConfigManager
  ) { };

  public async startWatch() {
    const serverSiderRenderConfig: any = await this.$ServerSiderConfigManager.getDevelopmentConfig();
    const serverSiderCompiler = webpack(serverSiderRenderConfig);
    serverSiderCompiler.watch({}, (error, stats) => {
      if (error) {
        console.log(error);
      } else {
        console.log(stats.toString({ colors: true }));
        // console.log("服务端编译完成!!!");
        return false;
      };
    });
  };

  public async startBuild() {
    const serverSiderRenderConfig: any = await this.$ServerSiderConfigManager.getProductionConfig();
    const serverSiderCompiler = webpack(serverSiderRenderConfig);
    await new Promise((resolve, reject) => {
      serverSiderCompiler.run((error, stats) => {
        if (error) {
          reject(error);
        } else {
          console.log(stats.toString({ colors: true }));
          resolve(true);
        };
      });
    });
  };

};

IOCContainer.bind(ServerSiderRenderService).toSelf().inSingletonScope();