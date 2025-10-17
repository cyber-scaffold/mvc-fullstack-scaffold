import { IOCContainer } from "@/library/commons/IOCContainer";
import { CompileDatabaseManager } from "@/library/commons/CompileDatabaseManager";
import { FrameworkConfigManager } from "@/library/commons/FrameworkConfigManager";
import { CompilerActionService } from "@/library/services/preprocess/CompilerActionService";

export async function compileConfiguration() {
  const $FrameworkConfigManager = IOCContainer.get(FrameworkConfigManager);
  await $FrameworkConfigManager.initialize();
  const $CompilerActionService = IOCContainer.get(CompilerActionService);
  await $CompilerActionService.initialize();
  const $CompileDatabaseManager = IOCContainer.get(CompileDatabaseManager);
  await $CompileDatabaseManager.initialize();
};