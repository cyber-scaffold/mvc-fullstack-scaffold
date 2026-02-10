import { IOCContainer } from "@/library/commons/IOCContainer";
import { CompilationConfigManager } from "@/library/commons/CompilationConfigManager";

/**
 * 获取运行时的相关配置(主要包括在运行时计算出来的物料资源的目录)
 * **/
export async function getRuntimeConfiguration() {
  const $CompilationConfigManager = IOCContainer.get(CompilationConfigManager);
  const runtimeConfig = $CompilationConfigManager.getRuntimeConfig();
  return runtimeConfig;
};