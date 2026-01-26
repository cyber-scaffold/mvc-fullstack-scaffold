#!/usr/bin/env node
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";
import { IOCContainer } from "@/frameworks/commons/IOCContainer";

import { MaterielResourceDevelopmentController } from "@/frameworks/controllers/MaterielResource/MaterielResourceDevelopmentController";
import { ApplicationDevelopmentController } from "@/frameworks/controllers/ServerApplication/ApplicationDevelopmentController";
import { CompilerActionService } from "@/frameworks/services/preprocess/CompilerActionService";

setImmediate(async () => {
  try {
    await IOCContainer.get(FrameworkConfigManager).initialize();
    await IOCContainer.get(CompilerActionService).cleanDestnation();
    await IOCContainer.get(MaterielResourceDevelopmentController).startDevelopmentMode();
    // await IOCContainer.get(ApplicationDevelopmentController).execute();
  } catch (error) {
    console.log("error", error);
    process.exit(0);
  };
});