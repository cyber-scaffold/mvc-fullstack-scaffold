/**
 * 服务端运行时阶段需要使用的方法
 * **/
export { setRuntimeConfiguration } from "@/library/sections/runtime/setRuntimeConfiguration";
export { getRuntimeConfiguration } from "@/library/sections/runtime/getRuntimeConfiguration";
export { getHydrationResource } from "@/library/sections/runtime/getHydrationResource";
export { getDehydratedResource } from "@/library/sections/runtime/getDehydratedResource";
export { renderDehydratedResourceWithSandbox } from "@/library/sections/runtime/renderDehydratedResourceWithSandbox";

export type { IRuntimeConfig } from "@/library/commons/RuntimeConfigManager";
export type { ICompileAssetsList } from "@/library/utils/filterWebpackStats";