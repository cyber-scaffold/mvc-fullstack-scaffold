import { IOCContainer } from "@/library/commons/IOCContainer";
import { DehydrationCompileService } from "@/library/services/compile/DehydrationCompileService";
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
  // const $DehydrationCompileService = IOCContainer.get(DehydrationCompileService);
  // const assetsFileList = await $DehydrationCompileService.startBuild(params.source);
  // console.log("脱水渲染资源清单", assetsFileList);
};