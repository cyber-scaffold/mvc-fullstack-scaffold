#!/usr/bin/env node
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";
import { IOCContainer } from "@/frameworks/commons/IOCContainer";

import { MaterielResourceBuildController } from "@/frameworks/controllers/MaterielResource/MaterielResourceBuildController";
import { ApplicationBuildController } from "@/frameworks/controllers/ServerApplication/ApplicationBuildController";
import { CompilerActionService } from "@/frameworks/services/preprocess/CompilerActionService";

setImmediate(async () => {
  try {
    await IOCContainer.get(FrameworkConfigManager).initialize();
    await IOCContainer.get(CompilerActionService).cleanDestnation();
    /** 编译SSR物料 **/
    await IOCContainer.get(MaterielResourceBuildController).buildMaterielResource();
    /** 编译Express主服务应用 **/
    await IOCContainer.get(ApplicationBuildController).execute();
  } catch (error) {
    console.log("error", error);
    process.exit(0);
  };
});
