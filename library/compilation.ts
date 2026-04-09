/**
 * 工程脚本编译和制作物料阶段使用的方法
 * **/
export { setCompileConfiguration } from "@/library/sections/compilation/setCompileConfiguration";
export { makeDehydratedResource } from "@/library/sections/compilation/makeDehydratedResource";
export { makeHydrationResource } from "@/library/sections/compilation/makeHydrationResource";

export type { ICompilationConfig } from "@/library/commons/CompilationConfigManager";
export type { ICompileAssetsList } from "@/library/utils/filterWebpackStats";