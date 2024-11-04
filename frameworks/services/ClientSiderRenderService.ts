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

  private async excuteCompilerTask() {
    if (this.processCompilerTask) {
      this.processCompilerTask.close(() => { });
    };
    const compilerFileList = this.$InspectDirectivePrologueService.getCompilerFileList();
    const $ClientSiderConfigManager = this.$ClientSiderConfigManagerProvider();
    $ClientSiderConfigManager.setCompilerFileInfoList(compilerFileList);
    const clientSiderRenderConfig: any = await $ClientSiderConfigManager.getDevelopmentConfig();
    const clientSiderCompiler = webpack(clientSiderRenderConfig);
    this.processCompilerTask = clientSiderCompiler;
    clientSiderCompiler.run((error, stats) => {
      if (error) {
        console.log(error);
      } else {
        console.log(stats.toString({ colors: true }));
      };
      this.processCompilerTask.close(() => { });
    });
  };

  public async startWatch() {
    const { clinetCompilerConfig } = this.$FrameworkConfigManager.getRuntimeConfig();
    /** 先获取客户端文件的编译清单 **/
    await this.$InspectDirectivePrologueService.extractDirectivePrologueSourceFile();
    /** 根据编译清单来创建webpack编译对象 **/
    const watcher = chokidar.watch(path.resolve(process.cwd(), clinetCompilerConfig.source), { ignoreInitial: true, persistent: true });
    watcher.on("all", this.excuteCompilerTask.bind(this));
    // watcher.on("unlink", this.excuteCompilerTask.bind(this));
    // watcher.on("unlinkDir", this.excuteCompilerTask.bind(this));
    // watcher.on("error", this.excuteCompilerTask.bind(this));
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