/**
 * 服务端运行时阶段需要使用的方法
 * **/
export { renderDehydratedResourceWithSandbox } from "@/library/runtime/renderDehydratedResourceWithSandbox";
export { setRuntimeConfiguration } from "@/library/runtime/setRuntimeConfiguration";
export { getRuntimeConfiguration } from "@/library/runtime/getRuntimeConfiguration";
export { getDehydratedResource } from "@/library/runtime/getDehydratedResource";
export { getHydrationResource } from "@/library/runtime/getHydrationResource";

export type { ICompileAssetsList } from "@/library/public/filterWebpackStats";
export type { IRuntimeConfig } from "@/library/runtime/commons/RuntimeConfigManager";
