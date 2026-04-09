/**
 * 服务端运行时阶段需要使用的方法
 * **/
export { renderDehydratedResourceWithSandbox } from "@/library/sections/runtime/renderDehydratedResourceWithSandbox";
export { setRuntimeConfiguration } from "@/library/sections/runtime/setRuntimeConfiguration";
export { getRuntimeConfiguration } from "@/library/sections/runtime/getRuntimeConfiguration";
export { getDehydratedResource } from "@/library/sections/runtime/getDehydratedResource";
export { getHydrationResource } from "@/library/sections/runtime/getHydrationResource";

export type { ICompileAssetsList } from "@/library/utils/filterWebpackStats";
export type { IRuntimeConfig } from "@/library/commons/RuntimeConfigManager";
