import { injectable, inject } from "inversify";

import { IOCContainer } from "@/library/commons/IOCContainer";

import { CompileDatabaseManager } from "@/library/commons/CompileDatabaseManager";
import { DehydrationCompileService } from "@/library/services/compile/DehydrationCompileService";

import { ResourceManagementInterface } from "@/library/services/mechanism/ResourceManagementInterface";

/**
 * 脱水资源的资源管理器
 * 如果源代码发生改变,并且不是开发模式的情况下,获取脱水资源的时候就要重新编译
 * **/
@injectable()
export class DehydrationResourceManagement implements ResourceManagementInterface {

  private sourceCodeFilePath: string;

  constructor(
    @inject(DehydrationCompileService) private readonly $DehydrationCompileService: DehydrationCompileService
  ) { }

  /**
   * 关联源代码同时做个资源检测,如果不存在的话需要提示
   * **/
  public async relationSourceCode(sourceCodeFilePath: string) {
    this.sourceCodeFilePath = sourceCodeFilePath;
  };

  /**
   * 判断源代码是否有编译记录,没有编译记录并且允许编译的情况下就会自动触发编译
   * **/
  public async smartDecide() {

  };

  /**
   * 先执行完smartDecide之后在运行该函数获取编译记录
   * **/
  public async getResourceList() {

    return [];
  };

};

IOCContainer.bind(DehydrationResourceManagement).toSelf().inRequestScope();
