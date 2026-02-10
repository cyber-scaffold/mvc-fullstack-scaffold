/**
 * 工程脚本编译和制作物料阶段使用的方法
 * **/
export { compileConfiguration } from "@/library/cores/compilation/compileConfiguration";
export { makeHydrationResource } from "@/library/cores/compilation/makeHydrationResource";
export { makeDehydratedResource } from "@/library/cores/compilation/makeDehydratedResource";

export type { ICompilationConfig } from "@/library/commons/CompilationConfigManager";
export type { ICompileAssetsList } from "@/library/utils/filterWebpackStats";