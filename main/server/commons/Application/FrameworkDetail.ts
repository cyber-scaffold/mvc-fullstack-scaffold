import path from "path";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/main/server/commons/Application/IOCContainer";

@injectable()
export class FrameworkDetail {

  /**
   * 项目根目录的绝对路径
   * **/
  public projectDirectoryPath = path.resolve(path.dirname(__filename), "../");

  /**
   * 框架层的基准目录是根据 项目根目录的绝对路径 计算得到的
   * **/
  get frameworkDirectory() {
    return path.join(this.projectDirectoryPath, "./dist/frameworks");
  };

};


IOCContainer.bind(FrameworkDetail).toSelf().inSingletonScope();
