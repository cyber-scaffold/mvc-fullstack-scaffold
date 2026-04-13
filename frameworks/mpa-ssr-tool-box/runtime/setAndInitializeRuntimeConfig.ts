import { IOCContainer } from "@/frameworks/mpa-ssr-tool-box/runtime/cores/IOCContainer";
import { RuntimeConfigManager } from "@/frameworks/mpa-ssr-tool-box/runtime/commons/RuntimeConfigManager";
import { RuntimeMaterielResourceDatabaseManager } from "@/frameworks/mpa-ssr-tool-box/runtime/commons/RuntimeMaterielResourceDatabaseManager";

export async function setAndInitializeRuntimeConfig(inputCustmerConfig?: any): Promise<void> {
  /** 初始化配置文件 **/
  const $RuntimeConfigManager = IOCContainer.get(RuntimeConfigManager);
  await $RuntimeConfigManager.initialize(inputCustmerConfig);
  /** 初始化物料数据库 **/
  const $RuntimeMaterielResourceDatabaseManager = IOCContainer.get(RuntimeMaterielResourceDatabaseManager);
  await $RuntimeMaterielResourceDatabaseManager.initialize();
};