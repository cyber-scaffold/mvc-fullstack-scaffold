/**
 * 服务端运行时阶段需要使用的方法
 * **/
export { runtimeConfiguration } from "@/library/cores/runtime/runtimeConfiguration";
export { getRuntimeConfiguration } from "@/library/cores/runtime/getRuntimeConfiguration";
export { getHydrationResource } from "@/library/cores/runtime/getHydrationResource";
export { getDehydratedResource } from "@/library/cores/runtime/getDehydratedResource";
export { renderDehydratedResourceWithSandbox } from "@/library/cores/runtime/renderDehydratedResourceWithSandbox";

export type { IRuntimeConfig } from "@/library/commons/RuntimeConfigManager";
export type { ICompileAssetsList } from "@/library/utils/filterWebpackStats";