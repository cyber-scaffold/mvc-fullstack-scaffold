import path from "path";
import chokidar from "chokidar";
import { webpack, Compiler } from "webpack";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/commons/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";

import { ClientSiderConfigManagerFactory, ClientSiderConfigManagerProvider } from "@/frameworks/configs/platforms/ClientSiderConfigManager";
import { InspectDirectivePrologueService, WebpackCompilerFileType } from "@/frameworks/services/preprocess/InspectDirectivePrologueService";

@injectable()
export class ClientSiderRenderService {

  /**
   * 正在进行的编译任务列表
   * **/
  private processCompilerTask: Compiler;

  constructor(
    @inject(ClientSiderConfigManagerFactory) private readonly $ClientSiderConfigManagerProvider: ClientSiderConfigManagerProvider,
    @inject(InspectDirectivePrologueService) private readonly $InspectDirectivePrologueService: InspectDirectivePrologueService,
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager
  ) { };

  /**
   * 每次文件发生改变的时候执行的回调函数
   * **/
  private async excuteCompilerTask() {
    /** 立即停止当前正在执行的编译任务 **/
    if (this.processCompilerTask) {
      await new Promise((resolve, reject) => {
        this.processCompilerTask.close((error) => error ? reject(error) : resolve(true));
      });
      this.processCompilerTask = undefined;
    };
    /** 先获取客户端文件的编译清单 **/
    await this.$InspectDirectivePrologueService.extractDirectivePrologueSourceFile();
    const compilerFileList = this.$InspectDirectivePrologueService.getCompilerFileList();
    // console.log("compilerFileList", compilerFileList);
    /** 配置临时的webpack编译对象 **/
    const $ClientSiderConfigManager = this.$ClientSiderConfigManagerProvider();
    $ClientSiderConfigManager.setCompilerFileInfoList(compilerFileList);
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
  };

  public async startWatch() {
    const { clinetCompilerConfig } = this.$FrameworkConfigManager.getRuntimeConfig();
    /** 监控视图层文件夹的文件变化 **/
    const watchPath = path.resolve(process.cwd(), clinetCompilerConfig.source);
    const watcher = chokidar.watch(watchPath, { ignoreInitial: true, persistent: true });
    watcher.on("all", this.excuteCompilerTask.bind(this));
    await this.excuteCompilerTask();
  };

  public async startBuild() {
    /** 先获取客户端文件的编译清单 **/
    await this.$InspectDirectivePrologueService.extractDirectivePrologueSourceFile();
    const compilerFileList = this.$InspectDirectivePrologueService.getCompilerFileList();
    /** 配置临时的webpack编译对象 **/
    const $ClientSiderConfigManager = this.$ClientSiderConfigManagerProvider();
    $ClientSiderConfigManager.setCompilerFileInfoList(compilerFileList);
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
  };

};

IOCContainer.bind(ClientSiderRenderService).toSelf().inSingletonScope();