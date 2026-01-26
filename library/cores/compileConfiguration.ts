import { IOCContainer } from "@/library/commons/IOCContainer";
import { FrameworkConfigManager } from "@/library/commons/FrameworkConfigManager";
import { CompileDatabaseManager } from "@/library/commons/CompileDatabaseManager";
import { CompilerActionService } from "@/library/services/preprocess/CompilerActionService";

export async function compileConfiguration(inputCustmerConfig?: any): Promise<void> {
  /** 初始化配置文件 **/
  const $FrameworkConfigManager = IOCContainer.get(FrameworkConfigManager);
  await $FrameworkConfigManager.initialize(inputCustmerConfig);
  /** 初始化工程环境 **/
  const $CompilerActionService = IOCContainer.get(CompilerActionService);
  await $CompilerActionService.initialize();
  /** 初始化编译数据库 **/
  const $CompileDatabaseManager = IOCContainer.get(CompileDatabaseManager);
  await $CompileDatabaseManager.initialize();
};