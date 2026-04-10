/**
 * 服务端运行时阶段需要使用的方法
 * **/
export { renderDehydratedResourceWithSandbox } from "@/library/runtime/renderDehydratedResourceWithSandbox";
export { setAndInitializeRuntimeConfig } from "@/library/runtime/setAndInitializeRuntimeConfig";
export { getRuntimeConfiguration } from "@/library/runtime/getRuntimeConfiguration";
export { getDehydratedResource } from "@/library/runtime/getDehydratedResource";
export { getHydrationResource } from "@/library/runtime/getHydrationResource";

export { saveProjectDirectoryAbsolutePathWithRuntime } from "@/library/runtime/globalSingletonStorage";
export { readProjectDirectoryAbsolutePathWithRuntime } from "@/library/runtime/globalSingletonStorage";

export { saveProjectEntryFileAbsolutePathWithRuntime } from "@/library/runtime/globalSingletonStorage";
export { readProjectEntryFileAbsolutePathWithRuntime } from "@/library/runtime/globalSingletonStorage";

export type { ICompileAssetsList } from "@/library/public/filterWebpackStats";
export type { IRuntimeConfig } from "@/library/runtime/commons/RuntimeConfigManager";