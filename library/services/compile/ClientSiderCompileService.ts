import { webpack, Compiler } from "webpack";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/library/commons/IOCContainer";
import { FrameworkConfigManager } from "@/library/commons/FrameworkConfigManager";

import { ClientSiderConfigManager } from "@/library/configs/platforms/ClientSiderConfigManager";


@injectable()
export class ClientSiderCompileService {

  /**
   * 正在进行的编译任务列表
   * **/
  private processCompilerTask: Compiler;

  constructor(
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager,
    @inject(ClientSiderConfigManager) private readonly $ClientSiderConfigManager: ClientSiderConfigManager
  ) { };

  public async startWatch(sourceCodeRelativePathList) {
    /** 配置临时的webpack编译对象 **/
    this.$ClientSiderConfigManager.setCompilerFileInfoList(sourceCodeRelativePathList);
    /** 获取开发环境下的编译配置 **/
    const clientSiderRenderConfig: any = await this.$ClientSiderConfigManager.getDevelopmentConfig();
    /** 开启一个编译对象 **/
    this.processCompilerTask = webpack(clientSiderRenderConfig);
    this.processCompilerTask.watch({}, async (error, stats) => {
      if (error) {
        console.log(error);
      } else {
        console.log(stats.toString({ colors: true }));
        // console.log("客户端编译完成!!!");
        return false;
      };
    });
  };

  public async startBuild(sourceCodeRelativePathList) {
    /** 配置临时的webpack编译对象 **/
    this.$ClientSiderConfigManager.setCompilerFileInfoList(sourceCodeRelativePathList);
    /** 获取开发环境下的编译配置 **/
    const clientSiderRenderConfig: any = await this.$ClientSiderConfigManager.getDevelopmentConfig();
    /** 开启一个编译对象 **/
    this.processCompilerTask = webpack(clientSiderRenderConfig);
    this.processCompilerTask.run(async (error, stats) => {
      if (error) {
        console.log(error);
      } else {
        console.log(stats.toString({ colors: true }));
        // console.log("客户端编译完成!!!");
        return false;
      };
    });
  };

};

IOCContainer.bind(ClientSiderCompileService).toSelf().inSingletonScope();