import { IOCContainer } from "@/frameworks/mpa-ssr-tool-box/compilation/cores/IOCContainer";
import { MakeHydrationResource } from "@/frameworks/mpa-ssr-tool-box/compilation/actions/MakeHydrationResource";

export type makeHydrationResourceParamsType = {
  /** 运行模式 **/
  mode: "development" | "production" | "none"
  /** 是否使用watch模式监听文件的改变 **/
  watch: boolean
};

/**
 * 编译注水物料的入口函数
 * **/
export async function makeHydrationResource(params: makeHydrationResourceParamsType) {
  const $MakeHydrationResource = IOCContainer.get(MakeHydrationResource);
  if (params.mode === "development") {
    await $MakeHydrationResource.checkSourceCodeAndTransformer();
    await $MakeHydrationResource.makeResourceWithWatchMode();
  };
  if (params.mode === "production") {
    await $MakeHydrationResource.checkSourceCodeAndTransformer();
    await $MakeHydrationResource.makeResourceWithBuildMode();
  };
};