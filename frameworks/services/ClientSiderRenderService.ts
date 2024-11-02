import { webpack } from "webpack";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/configs/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/configs/FrameworkConfigManager";
import { ClientSiderConfigManager } from "@/frameworks/configs/ClientSiderConfigManager";

@injectable()
export class ClientSiderRenderService {

  constructor(
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager,
    @inject(ClientSiderConfigManager) private readonly $ClientSiderConfigManager: ClientSiderConfigManager
  ) { };

  public async startWatch() {
    const clientSiderRenderConfig: any = await this.$ClientSiderConfigManager.getDevelopmentConfig();
    const clientSiderCompiler = webpack(clientSiderRenderConfig);
    clientSiderCompiler.watch({}, (error, stats) => {
      if (error) {
        console.log(error);
      } else {
        console.log(stats.toString({ colors: true }));
      };
    });
  };

  public async startBuild() {
    const clientSiderRenderConfig: any = await this.$ClientSiderConfigManager.getProductionConfig();
    const clientSiderCompiler = webpack(clientSiderRenderConfig);
    clientSiderCompiler.run((error, stats) => {
      if (error) {
        console.log(error);
      } else {
        console.log(stats.toString({ colors: true }));
      };
    });
  };

};

IOCContainer.bind(ClientSiderRenderService).toSelf().inSingletonScope();