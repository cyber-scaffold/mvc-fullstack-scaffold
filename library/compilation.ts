/**
 * 工程脚本编译和制作物料阶段使用的方法
 * **/
export { setCompileConfiguration } from "@/library/compilation/setCompileConfiguration";
export { makeDehydratedResource } from "@/library/compilation/makeDehydratedResource";
export { makeHydrationResource } from "@/library/compilation/makeHydrationResource";

export type { ICompilationConfig } from "@/library/compilation/commons/CompilationConfigManager";
export type { ICompileAssetsList } from "@/library/public/filterWebpackStats";