/**
 * 工程脚本编译和制作物料阶段使用的方法
 * **/
export { compileConfiguration } from "@/library/cores/compileConfiguration";
export { makeHydrationResource } from "@/library/cores/makeHydrationResource";
export { makeDehydratedResource } from "@/library/cores/makeDehydratedResource";

export type { IFrameworkConfig } from "@/library/commons/FrameworkConfigManager";
export type { ICompileAssetsList } from "@/library/utils/filterWebpackStats";