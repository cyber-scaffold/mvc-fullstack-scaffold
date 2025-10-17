import { IOCContainer } from "@/library/commons/IOCContainer";
import { DehydrationResourceManagement } from "@/library/services/mechanism/DehydrationResourceManagement";

export type DehydratedRenderMethodParamsType = {
  source: string
};

/**
 * 获取服务端脱水渲染方法的函数
 * **/
export async function compileDehydratedRenderMethod(params: DehydratedRenderMethodParamsType) {
  const $DehydrationResourceManagement = IOCContainer.get(DehydrationResourceManagement);
  await $DehydrationResourceManagement.relationSourceCode(params.source);
  await $DehydrationResourceManagement.smartDecide();
  const compileAssetsInfo = await $DehydrationResourceManagement.getResourceList();
  return compileAssetsInfo.assets;
};