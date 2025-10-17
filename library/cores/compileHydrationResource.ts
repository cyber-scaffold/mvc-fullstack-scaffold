import { IOCContainer } from "@/library/commons/IOCContainer";
import { HydrationResourceManagement } from "@/library/services/mechanism/HydrationResourceManagement";

export type HydrationResourceParamsType = {
  source: string
};

/**
 * 获取客户端注水渲染相关资源的函数
 * **/
export async function compileHydrationResource(params: HydrationResourceParamsType) {
  const $HydrationResourceManagement = IOCContainer.get(HydrationResourceManagement);
  await $HydrationResourceManagement.relationSourceCode(params.source);
  await $HydrationResourceManagement.smartDecide();
  const compileAssetsInfo = await $HydrationResourceManagement.getResourceList();
  return compileAssetsInfo;
};