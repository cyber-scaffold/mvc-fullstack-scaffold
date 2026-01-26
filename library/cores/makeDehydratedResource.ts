import { IOCContainer } from "@/library/commons/IOCContainer";
import { DehydrationResourceManagement } from "@/library/services/mechanism/DehydrationResourceManagement";

export type DehydratedRenderMethodParamsType = {
  /** 脱水物料的别名,在后期获取物料的时候需要使用到,建议全局唯一 **/
  alias: string
  /** 脱水物料指向的原文件 **/
  source: string
};

/**
 * 编译脱水物料的入口函数
 * **/
export async function makeDehydratedResource(params: DehydratedRenderMethodParamsType) {
  const $DehydrationResourceManagement = IOCContainer.get(DehydrationResourceManagement);
  await $DehydrationResourceManagement.relationSourceCode(params.source);
  await $DehydrationResourceManagement.smartDecide();
  const compileAssetsInfo = await $DehydrationResourceManagement.getResourceList();
  return compileAssetsInfo.assets;
};