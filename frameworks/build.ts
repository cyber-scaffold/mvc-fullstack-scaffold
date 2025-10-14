#!/usr/bin/env node
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";
import { IOCContainer } from "@/frameworks/commons/IOCContainer";

import { BuildController } from "@/frameworks/controllers/BuildController";

import { CompilerProgressService } from "@/frameworks/services/progress/CompilerProgressService";
import { CompilerActionService } from "@/frameworks/services/preprocess/CompilerActionService";

setImmediate(async () => {
  try {
    await IOCContainer.get(FrameworkConfigManager).initialize();
    await IOCContainer.get(CompilerActionService).cleanDestnation();
    await IOCContainer.get(CompilerProgressService).initialize();
    await IOCContainer.get(BuildController).execute();
  } catch (error) {
    console.log("error", error);
    process.exit(0);
  };
});
