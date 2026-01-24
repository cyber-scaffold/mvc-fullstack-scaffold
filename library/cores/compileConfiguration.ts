import { IOCContainer } from "@/library/commons/IOCContainer";
import { CompileDatabaseManager } from "@/library/commons/CompileDatabaseManager";
import { FrameworkConfigManager } from "@/library/commons/FrameworkConfigManager";
import { CompilerActionService } from "@/library/services/preprocess/CompilerActionService";

import type { IFrameworkConfig } from "@/library/commons/FrameworkConfigManager";

export async function compileConfiguration(): Promise<IFrameworkConfig> {
  /** 初始化配置文件 **/
  const $FrameworkConfigManager = IOCContainer.get(FrameworkConfigManager);
  await $FrameworkConfigManager.initialize();
  /** 初始化工程环境 **/
  const $CompilerActionService = IOCContainer.get(CompilerActionService);
  await $CompilerActionService.initialize();
  /** 初始化编译数据库 **/
  const $CompileDatabaseManager = IOCContainer.get(CompileDatabaseManager);
  await $CompileDatabaseManager.initialize();
  /** 返回运行时的参数 **/
  return await $FrameworkConfigManager.getRuntimeConfig();
};