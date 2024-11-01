import { webpack } from "webpack";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/configs/IOCContainer";
import { ApplicationConfigManager } from "@/frameworks/configs/ApplicationConfigManager";
import { ServerSiderConfigManager } from "@/frameworks/configs/ServerSiderConfigManager";

@injectable()
export class ServerSiderRenderService {

  constructor(
    @inject(ApplicationConfigManager) private readonly $ApplicationConfigManager: ApplicationConfigManager,
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
      };
    });
  };

  public async startBuild() {
    const serverSiderRenderConfig: any = await this.$ServerSiderConfigManager.getProductionConfig();
    const serverSiderCompiler = webpack(serverSiderRenderConfig);
    serverSiderCompiler.run((error, stats) => {
      if (error) {
        console.log(error);
      } else {
        console.log(stats.toString({ colors: true }));
      };
    });
  };

};

IOCContainer.bind(ServerSiderRenderService).toSelf().inSingletonScope();