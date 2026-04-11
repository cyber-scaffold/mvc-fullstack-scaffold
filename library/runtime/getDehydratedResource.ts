import { IOCContainer } from "@/library/runtime/cores/IOCContainer";
import { DehydrationResourceManagement } from "@/library/runtime/services/DehydrationResourceManagement";

import { CompileAssetsListQueryResult } from "@/library/public/ResourceManagementInterface";

export type getDehydratedResourceParamsType = {
  /** 脱水物料的别名 **/
  alias: string
};

/**
 * 获取脱水物料资源的入口函数
 * **/
export async function getDehydratedResource({ alias }: getDehydratedResourceParamsType): Promise<CompileAssetsListQueryResult> {
  const $DehydrationResourceManagement = IOCContainer.get(DehydrationResourceManagement);
  const compileAssetsInfo = await $DehydrationResourceManagement.getResourceListWithAlias(alias);
  if (!compileAssetsInfo) {
    return false;
  }
  return compileAssetsInfo;
};