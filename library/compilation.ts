/**
 * 工程脚本编译和制作物料阶段使用的方法
 * **/
export { setCompileConfiguration } from "@/library/compilation/setCompileConfiguration";
export { makeDehydratedResource } from "@/library/compilation/makeDehydratedResource";
export { makeHydrationResource } from "@/library/compilation/makeHydrationResource";

export type { MaterielCompilationInfoType } from "@/library/compilation/commons/CompilationConfigManager";
export type { CompilationConfigType, CustmerInputCompilationConfigType } from "@/library/compilation/commons/CompilationConfigManager";
export type { CompileAssetsDictionaryType } from "@/library/public/filterWebpackStats";