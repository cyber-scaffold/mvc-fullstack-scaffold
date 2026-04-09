import path from "path";
import { setAndInitializeRuntimeConfig } from "@/library/runtime";
import { IOCContainer } from "@/main/server/cores/IOCContainer";

import { ApplicationConfigManager } from "@/main/server/commons/Application/ApplicationConfigManager";
import { ExpressHttpServer } from "@/main/server/commons/Application/ExpressHttpServer";

setImmediate(async () => {
  /**
   * 为运行时的物料管理库提供 项目目录的绝对路径
   * 项目目录的绝对路径是基于当前文件的绝对路径计算得到的
   * **/
  await setAndInitializeRuntimeConfig({
    projectDirectoryPath: path.resolve(path.dirname(__filename), "../")
  });
  await IOCContainer.get(ApplicationConfigManager).initialize();
  const serverApplicationInstance = IOCContainer.get(ExpressHttpServer);
  await serverApplicationInstance.bootstrap();
});