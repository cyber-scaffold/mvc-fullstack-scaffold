#!/usr/bin/env node
import { IOCContainer } from "@/frameworks/cores/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";

import { MakeMaterielResourceBuildController } from "@/frameworks/controllers/MakeMaterielResource/MakeMaterielResourceBuildController";
import { ApplicationBuildController } from "@/frameworks/controllers/MakeServerApplication/ApplicationBuildController";
// import { DLLBuildController } from "@/frameworks/controllers/ProjectOptimization/DLLBuildController";
import { CompilerActionService } from "@/frameworks/services/CompilerActionService";

setImmediate(async () => {
  try {
    await IOCContainer.get(FrameworkConfigManager).initialize();
    await IOCContainer.get(CompilerActionService).cleanDestnation();
    /** 编译DLL **/
    // await IOCContainer.get(DLLBuildController).execute();
    /** 编译SSR物料 **/
    await IOCContainer.get(MakeMaterielResourceBuildController).buildMaterielResource();
    /** 编译Express主服务应用 **/
    await IOCContainer.get(ApplicationBuildController).execute();
  } catch (error) {
    console.log("error", error);
    process.exit(0);
  };
});
