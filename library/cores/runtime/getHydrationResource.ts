import { IOCContainer } from "@/library/commons/IOCContainer";
import { HydrationResourceManagement } from "@/library/services/mechanism/HydrationResourceManagement";


export type getHydrationResourceParamsType = {
  /** 注水物料的别名 **/
  alias: string
};

/**
 * 获取注水物料资源的入口函数
 * **/
export async function getHydrationResource({ alias }: getHydrationResourceParamsType) {
  const $HydrationResourceManagement = IOCContainer.get(HydrationResourceManagement);
  const compileAssetsInfo = await $HydrationResourceManagement.getResourceListWithAlias(alias);
  return compileAssetsInfo;
};