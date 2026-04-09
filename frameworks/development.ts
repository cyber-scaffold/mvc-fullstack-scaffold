#!/usr/bin/env node
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";
import { IOCContainer } from "@/frameworks/cores/IOCContainer";

import { MaterielResourceDevelopmentController } from "@/frameworks/controllers/MaterielResource/MaterielResourceDevelopmentController";
import { ApplicationDevelopmentController } from "@/frameworks/controllers/ServerApplication/ApplicationDevelopmentController";
// import { DLLBuildController } from "@/frameworks/controllers/ServerApplication/DLLBuildController";
import { CompilerActionService } from "@/frameworks/services/preprocess/CompilerActionService";

setImmediate(async () => {
  try {
    await IOCContainer.get(FrameworkConfigManager).initialize();
    await IOCContainer.get(CompilerActionService).cleanDestnation();
    /** 编译DLL **/
    // await IOCContainer.get(DLLBuildController).execute();
    /** 开发模式SSR物料编译 **/
    await IOCContainer.get(MaterielResourceDevelopmentController).startDevelopmentMode();
    /** 开发模式Express主服务应用编译 **/
    await IOCContainer.get(ApplicationDevelopmentController).execute();
  } catch (error) {
    console.log("error", error);
    process.exit(0);
  };
});