import { IOCContainer } from "@/frameworks/mpa-ssr-tool-box/runtime/cores/IOCContainer";
import { HydrationResourceManagement } from "@/frameworks/mpa-ssr-tool-box/runtime/services/HydrationResourceManagement";

import type { HydrationCompileAssetsListQueryResult } from "@/frameworks/mpa-ssr-tool-box/runtime/services/HydrationResourceManagement";

export type getHydrationResourceParamsType = {
  /** 注水物料的别名 **/
  alias: string
};

/**
 * 获取注水物料资源的入口函数
 * **/
export async function getHydrationResource({ alias }: getHydrationResourceParamsType): Promise<HydrationCompileAssetsListQueryResult> {
  const $HydrationResourceManagement = IOCContainer.get(HydrationResourceManagement);
  const compileAssetsInfo = await $HydrationResourceManagement.getResourceListWithAlias(alias);
  if (!compileAssetsInfo) {
    return false;
  };
  return compileAssetsInfo;
};