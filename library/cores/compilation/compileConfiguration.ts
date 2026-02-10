import { IOCContainer } from "@/library/commons/IOCContainer";
import { CompilationConfigManager } from "@/library/commons/CompilationConfigManager";
import { MaterielResourceDatabaseManager } from "@/library/commons/MaterielResourceDatabaseManager";
import { CompilerActionService } from "@/library/services/preprocess/CompilerActionService";

export async function compileConfiguration(inputCustmerConfig?: any): Promise<void> {
  /** 初始化配置文件 **/
  const $CompilationConfigManager = IOCContainer.get(CompilationConfigManager);
  await $CompilationConfigManager.initialize(inputCustmerConfig);
  /** 初始化工程环境 **/
  const $CompilerActionService = IOCContainer.get(CompilerActionService);
  await $CompilerActionService.initialize();
  /** 初始化物料数据库 **/
  const $MaterielResourceDatabaseManager = IOCContainer.get(MaterielResourceDatabaseManager);
  await $MaterielResourceDatabaseManager.initialize();
};