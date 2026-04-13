import { IOCContainer } from "@/frameworks/mpa-ssr-tool-box/runtime/cores/IOCContainer";
import { DehydrationResourceManagement } from "@/frameworks/mpa-ssr-tool-box/runtime/services/DehydrationResourceManagement";

import type { DehydrationCompileAssetsListQueryResult } from "@/frameworks/mpa-ssr-tool-box/runtime/services/DehydrationResourceManagement";

export type getDehydratedResourceParamsType = {
  /** 脱水物料的别名 **/
  alias: string
};

/**
 * 获取脱水物料资源的入口函数
 * **/
export async function getDehydratedResource({ alias }: getDehydratedResourceParamsType): Promise<DehydrationCompileAssetsListQueryResult> {
  const $DehydrationResourceManagement = IOCContainer.get(DehydrationResourceManagement);
  const compileAssetsInfo = await $DehydrationResourceManagement.getResourceListWithAlias(alias);
  if (!compileAssetsInfo) {
    return false;
  }
  return compileAssetsInfo;
};