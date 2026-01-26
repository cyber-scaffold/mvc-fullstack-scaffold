import { IOCContainer } from "@/library/commons/IOCContainer";
import { HydrationResourceManagement } from "@/library/services/mechanism/HydrationResourceManagement";

export type HydrationResourceParamsType = {
  /** 注水物料的别名,在后期获取物料的时候需要使用到,建议全局唯一 **/
  alias: string
  /** 注水物料指向的原文件 **/
  source: string
};

/**
 * 编译注水物料的入口函数
 * **/
export async function makeHydrationResource(params: HydrationResourceParamsType) {
  const $HydrationResourceManagement = IOCContainer.get(HydrationResourceManagement);
  await $HydrationResourceManagement.relationSourceCode(params.source);
  await $HydrationResourceManagement.smartDecide();
  const compileAssetsInfo = await $HydrationResourceManagement.getResourceList();
  return compileAssetsInfo.assets;
};