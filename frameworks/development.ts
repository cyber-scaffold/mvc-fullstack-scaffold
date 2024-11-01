#!/usr/bin/env node
import { ApplicationConfigManager } from "@/frameworks/configs/ApplicationConfigManager";
import { IOCContainer } from "@/frameworks/configs/IOCContainer";

import { DevelopmentControllerProcess } from "@/frameworks/controllers/DevelopmentController";
import { CompilerProgressService } from "@/frameworks/services/CompilerProgressService";

setImmediate(async () => {
  try {
    await IOCContainer.get(ApplicationConfigManager).initialize();
    await IOCContainer.get(CompilerProgressService).initialize();
    await IOCContainer.get(DevelopmentControllerProcess).execute();
  } catch (error) {
    console.log("error", error);
    process.exit(0);
  };
});
