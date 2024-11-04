import path from "path";
import chokidar from "chokidar";
import { webpack, Compiler } from "webpack";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/commons/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";

import { ClientSiderConfigManagerFactory, ClientSiderConfigManagerProvider } from "@/frameworks/configs/ClientSiderConfigManager";
import { InspectDirectivePrologueService, WebpackCompilerFileType } from "@/frameworks/services/InspectDirectivePrologueService";

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
      this.processCompilerTask.close(() => { });
      this.processCompilerTask = null;
    };
    /** 获取需要编译的客户端文件的清单 **/
    const compilerFileList = this.$InspectDirectivePrologueService.getCompilerFileList();
    /** 配置临时的webpack编译配置对象 **/
    const $ClientSiderConfigManager = this.$ClientSiderConfigManagerProvider();
    $ClientSiderConfigManager.setCompilerFileInfoList(compilerFileList);
    const clientSiderRenderConfig: any = await $ClientSiderConfigManager.getDevelopmentConfig();
    /** 开启一个编译对象 **/
    this.processCompilerTask = webpack(clientSiderRenderConfig);
    this.processCompilerTask.run((error, stats) => {
      if (error) {
        console.log(error);
      } else {
        console.log(stats.toString({ colors: true }));
      };
      this.processCompilerTask.close(() => { });
      this.processCompilerTask = null;
    });
  };

  public async startWatch() {
    const { clinetCompilerConfig } = this.$FrameworkConfigManager.getRuntimeConfig();
    /** 先获取客户端文件的编译清单 **/
    await this.$InspectDirectivePrologueService.extractDirectivePrologueSourceFile();
    /** 根据编译清单来创建webpack编译对象 **/
    const watchPath = path.resolve(process.cwd(), clinetCompilerConfig.source);
    const watcher = chokidar.watch(watchPath, { ignoreInitial: true, persistent: true });
    watcher.on("all", this.excuteCompilerTask.bind(this));
    await this.excuteCompilerTask();
  };

  public async startBuild() {
    const $ClientSiderConfigManager = this.$ClientSiderConfigManagerProvider();
    const clientSiderRenderConfig: any = await $ClientSiderConfigManager.getProductionConfig();
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