/**
 * 服务端运行时阶段需要使用的方法
 * **/
export { renderDehydratedResourceWithSandbox } from "@/frameworks/mpa-ssr-tool-box/runtime/renderDehydratedResourceWithSandbox";
export { setAndInitializeRuntimeConfig } from "@/frameworks/mpa-ssr-tool-box/runtime/setAndInitializeRuntimeConfig";
export { getRuntimeConfiguration } from "@/frameworks/mpa-ssr-tool-box/runtime/getRuntimeConfiguration";
export { getDehydratedResource } from "@/frameworks/mpa-ssr-tool-box/runtime/getDehydratedResource";
export { getHydrationResource } from "@/frameworks/mpa-ssr-tool-box/runtime/getHydrationResource";
export { getResourceSummary } from "@/frameworks/mpa-ssr-tool-box/runtime/getResourceSummary";

export { saveProjectDirectoryAbsolutePath } from "@/frameworks/mpa-ssr-tool-box/runtime/globalSingletonStorage";
export { readProjectDirectoryAbsolutePath } from "@/frameworks/mpa-ssr-tool-box/runtime/globalSingletonStorage";

export { saveProjectEntryFileAbsolutePath } from "@/frameworks/mpa-ssr-tool-box/runtime/globalSingletonStorage";
export { readProjectEntryFileAbsolutePath } from "@/frameworks/mpa-ssr-tool-box/runtime/globalSingletonStorage";

export type { CompileAssetsDictionaryType } from "@/frameworks/mpa-ssr-tool-box/public/ResourceManager.d";
export type { RuntimeConfig } from "@/frameworks/mpa-ssr-tool-box/runtime/commons/RuntimeConfigManager";