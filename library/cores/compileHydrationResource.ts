import { IOCContainer } from "@/library/commons/IOCContainer";
import { HydrationCompileService } from "@/library/services/compile/HydrationCompileService";

export type HydrationResourceParamsType = {
  source: string
};

/**
 * 获取客户端注水渲染相关资源的函数
 * **/
export async function compileHydrationResource(params: HydrationResourceParamsType) {
  const $HydrationCompileService = IOCContainer.get(HydrationCompileService);
  const assetsFileList = await $HydrationCompileService.startBuild(params.source);
  console.log("注水渲染资源清单", assetsFileList);
};