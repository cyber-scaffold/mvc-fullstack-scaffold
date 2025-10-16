import { webpack, Compiler } from "webpack";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/library/commons/IOCContainer";
import { EventManager } from "@/library/commons/EventManager";

import { ClientSiderConfigManagerFactory, ClientSiderConfigManagerProvider } from "@/library/configs/platforms/ClientSiderConfigManager";


@injectable()
export class ClientSiderCompileService {

  /**
   * 正在进行的编译任务列表
   * **/
  private processCompilerTask: Compiler;

  constructor(
    @inject(EventManager) private readonly $EventManager: EventManager,
    @inject(ClientSiderConfigManagerFactory) private readonly $ClientSiderConfigManagerProvider: ClientSiderConfigManagerProvider
  ) { };

  public async startWatch() {
    this.$EventManager.registryReceiveRequirementClientModuleListCallback(async (sourceCodeRelativePathList: string[]) => {
      /** 立即停止当前正在执行的编译任务 **/
      if (this.processCompilerTask) {
        await new Promise((resolve, reject) => {
          this.processCompilerTask.close((error) => error ? reject(error) : resolve(true));
        });
        this.processCompilerTask = undefined;
      };
      /** 配置临时的webpack编译对象 **/
      const $ClientSiderConfigManager = this.$ClientSiderConfigManagerProvider();
      $ClientSiderConfigManager.setCompilerFileInfoList(sourceCodeRelativePathList);
      /** 获取开发环境下的编译配置 **/
      const clientSiderRenderConfig: any = await $ClientSiderConfigManager.getDevelopmentConfig();
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
    });
  };

  public async startBuild() {
    this.$EventManager.registryReceiveRequirementClientModuleListCallback(async (sourceCodeRelativePathList: string[]) => {
      /** 配置临时的webpack编译对象 **/
      const $ClientSiderConfigManager = this.$ClientSiderConfigManagerProvider();
      $ClientSiderConfigManager.setCompilerFileInfoList(sourceCodeRelativePathList);
      /** 获取生产环境下的编译配置 **/
      const clientSiderRenderConfig: any = await $ClientSiderConfigManager.getProductionConfig();
      const clientSiderCompiler = webpack(clientSiderRenderConfig);
      await new Promise((resolve, reject) => {
        clientSiderCompiler.run((error, stats) => {
          if (error) {
            reject(error);
          } else {
            // console.log(stats.toString({ colors: true }));
            resolve(true);
          };
        });
      });
    });
  };

};

IOCContainer.bind(ClientSiderCompileService).toSelf().inSingletonScope();