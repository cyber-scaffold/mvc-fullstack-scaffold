import { IOCContainer } from "@/library/runtime/cores/IOCContainer";
import { RuntimeConfigManager } from "@/library/runtime/commons/RuntimeConfigManager";
import { RuntimeMaterielResourceDatabaseManager } from "@/library/runtime/commons/RuntimeMaterielResourceDatabaseManager";

export async function setRuntimeConfiguration(inputCustmerConfig?: any): Promise<void> {
  /** 初始化配置文件 **/
  const $RuntimeConfigManager = IOCContainer.get(RuntimeConfigManager);
  await $RuntimeConfigManager.initialize(inputCustmerConfig);
  /** 初始化物料数据库 **/
  const $RuntimeMaterielResourceDatabaseManager = IOCContainer.get(RuntimeMaterielResourceDatabaseManager);
  await $RuntimeMaterielResourceDatabaseManager.initialize();
};