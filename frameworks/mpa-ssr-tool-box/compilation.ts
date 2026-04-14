/**
 * 工程脚本编译和制作物料阶段使用的方法
 * **/
export { setCompileConfiguration } from "@/frameworks/mpa-ssr-tool-box/compilation/setCompileConfiguration";
export { makeDehydratedResource } from "@/frameworks/mpa-ssr-tool-box/compilation/makeDehydratedResource";
export { makeHydrationResource } from "@/frameworks/mpa-ssr-tool-box/compilation/makeHydrationResource";

export type { MaterielCompilationInfoType, CompilationConfigType, CustmerInputCompilationConfigType } from "@/frameworks/mpa-ssr-tool-box/compilation/commons/CompilationConfigManager";
export type { CompileAssetsDictionaryType } from "@/frameworks/mpa-ssr-tool-box/public/ResourceManager.d";