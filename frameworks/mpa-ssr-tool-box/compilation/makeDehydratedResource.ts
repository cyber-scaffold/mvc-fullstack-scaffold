import { IOCContainer } from "@/frameworks/mpa-ssr-tool-box/compilation/cores/IOCContainer";
import { MakeDehydrationResource } from "@/frameworks/mpa-ssr-tool-box/compilation/actions/MakeDehydrationResource";

export type makeDehydratedResourceParamsType = {
  /** 运行模式 **/
  mode: "development" | "production" | "none"
  /** 是否使用watch模式监听文件的改变 **/
  watch: boolean
};

/**
 * 编译脱水物料的入口函数
 * **/
export async function makeDehydratedResource(params: makeDehydratedResourceParamsType) {
  const $MakeDehydrationResource = IOCContainer.get(MakeDehydrationResource);
  if (params.mode === "development") {
    await $MakeDehydrationResource.checkSourceCodeAndTransformer();
    await $MakeDehydrationResource.makeResourceWithWatchMode();
  };
  if (params.mode === "production") {
    await $MakeDehydrationResource.checkSourceCodeAndTransformer();
    await $MakeDehydrationResource.makeResourceWithBuildMode();
  };
};