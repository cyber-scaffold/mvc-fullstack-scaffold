#!/usr/bin/env node
import { IOCContainer } from "@/frameworks/cores/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";

import { MakeMaterielResourceDevelopmentController } from "@/frameworks/controllers/MakeMaterielResource/MakeMaterielResourceDevelopmentController";
import { ApplicationDevelopmentController } from "@/frameworks/controllers/MakeServerApplication/ApplicationDevelopmentController";
// import { DLLBuildController } from "@/frameworks/controllers/ProjectOptimization/DLLBuildController";
import { CompilerActionService } from "@/frameworks/services/CompilerActionService";

setImmediate(async () => {
  try {
    await IOCContainer.get(FrameworkConfigManager).initialize();
    await IOCContainer.get(CompilerActionService).cleanDestnation();
    /** 编译DLL文件 **/
    // await IOCContainer.get(DLLBuildController).execute();
    /** 开发模式SSR物料编译 **/
    await IOCContainer.get(MakeMaterielResourceDevelopmentController).startDevelopmentMode();
    /** 开发模式Express主服务应用编译 **/
    await IOCContainer.get(ApplicationDevelopmentController).execute();
  } catch (error) {
    console.log("error", error);
    process.exit(0);
  };
});