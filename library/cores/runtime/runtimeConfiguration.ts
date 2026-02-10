import { IOCContainer } from "@/library/commons/IOCContainer";
import { RuntimeConfigManager } from "@/library/commons/RuntimeConfigManager";
import { MaterielResourceDatabaseManager } from "@/library/commons/MaterielResourceDatabaseManager";

export async function runtimeConfiguration(inputCustmerConfig?: any): Promise<void> {
  /** 初始化配置文件 **/
  const $RuntimeConfigManager = IOCContainer.get(RuntimeConfigManager);
  await $RuntimeConfigManager.initialize(inputCustmerConfig);
  /** 初始化物料数据库 **/
  const $MaterielResourceDatabaseManager = IOCContainer.get(MaterielResourceDatabaseManager);
  await $MaterielResourceDatabaseManager.initialize();
};