import { IOCContainer } from "@/library/commons/IOCContainer";
import { FrameworkConfigManager } from "@/library/commons/FrameworkConfigManager";

/**
 * 获取运行时的相关配置(主要包括在运行时计算出来的物料资源的目录)
 * **/
export async function getRuntimeConfiguration() {
  const $FrameworkConfigManager = IOCContainer.get(FrameworkConfigManager);
  const runtimeConfig = $FrameworkConfigManager.getRuntimeConfig();
  return runtimeConfig;
};