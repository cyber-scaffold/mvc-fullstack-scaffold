import { IOCContainer } from "@/library/commons/IOCContainer";
import { CompileDatabaseManager } from "@/library/commons/CompileDatabaseManager";
import { FrameworkConfigManager } from "@/library/commons/FrameworkConfigManager";
import { CompilerActionService } from "@/library/services/preprocess/CompilerActionService";

import type { IFrameworkConfig } from "@/library/commons/FrameworkConfigManager";

export async function compileConfiguration(): Promise<IFrameworkConfig> {
  const $FrameworkConfigManager = IOCContainer.get(FrameworkConfigManager);
  await $FrameworkConfigManager.initialize();
  const $CompilerActionService = IOCContainer.get(CompilerActionService);
  await $CompilerActionService.initialize();
  const $CompileDatabaseManager = IOCContainer.get(CompileDatabaseManager);
  await $CompileDatabaseManager.initialize();
  return await $FrameworkConfigManager.getRuntimeConfig();
};