import path from "path";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/main/server/commons/Application/IOCContainer";

@injectable()
export class FrameworkDetail {

  /**
   * 框架层的基准目录
   * **/
  public frameworkDirectory = path.join(path.dirname(__filename), "frameworks");

};


IOCContainer.bind(FrameworkDetail).toSelf().inSingletonScope();
