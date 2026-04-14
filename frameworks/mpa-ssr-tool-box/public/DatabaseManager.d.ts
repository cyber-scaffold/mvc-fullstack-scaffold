import type { MaterielRenderType } from "@/frameworks/mpa-ssr-tool-box/compilation/commons/CompilationConfigManager";
import type { CompilerProgressStatus } from "@/frameworks/mpa-ssr-tool-box/compilation/utils/CompilerProgressPlugin";
import type { EveryCompileAssetsInfo } from "@/frameworks/mpa-ssr-tool-box/public/filterWebpackStats";

export type SummaryDatabaseDictionaryType = {
  [alias: string]: MaterielRenderType
};

export type CompilerProgressStatusType = CompilerProgressStatus.COMPILE | CompilerProgressStatus.EMIT | CompilerProgressStatus.DONE;

export type ResourceDatabaseDictionaryType = {

  status: CompilerProgressStatusType

  assets: {
    [alias: string]: EveryCompileAssetsInfo
  }

} | {};