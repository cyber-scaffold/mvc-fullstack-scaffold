#!/usr/bin/env node
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";
import { IOCContainer } from "@/frameworks/commons/IOCContainer";

import { BuildController } from "@/frameworks/controllers/BuildController";

import { EventManager } from "@/frameworks/commons/EventManager";
import { CompilerActionService } from "@/frameworks/services/preprocess/CompilerActionService";

setImmediate(async () => {
  try {
    await IOCContainer.get(EventManager).initialize();
    await IOCContainer.get(FrameworkConfigManager).initialize();
    await IOCContainer.get(CompilerActionService).cleanDestnation();
    await IOCContainer.get(BuildController).execute();
  } catch (error) {
    console.log("error", error);
    process.exit(0);
  };
});
