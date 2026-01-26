/**
 * 服务端运行时阶段需要使用的方法
 * **/
export { compileConfiguration } from "@/library/cores/compileConfiguration";
export { getRuntimeConfiguration } from "@/library/cores/getRuntimeConfiguration";
export { getHydrationResource } from "@/library/cores/getHydrationResource";
export { getDehydratedResource } from "@/library/cores/getDehydratedResource";
export { renderDehydratedResourceWithSandbox } from "@/library/cores/renderDehydratedResourceWithSandbox";

export type { IFrameworkConfig } from "@/library/commons/FrameworkConfigManager";
export type { ICompileAssetsList } from "@/library/utils/filterWebpackStats";