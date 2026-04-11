
import type { ICompileAssetsList } from "@/library/public/filterWebpackStats";

export type CompileAssetsListQueryResult = ICompileAssetsList | false

type BuildResourceWithUniqueAliasType = {
  alias: string
  mode: "development" | "production" | "none"
  watch: boolean
};

export interface ResourceManagementInterface {

  checkSourceCodeAndRelation?(sourceCodeFilePath: string): Promise<void | boolean>;

  buildResourceWithUniqueAlias?(alias: BuildResourceWithUniqueAliasType): Promise<void | boolean>;

  getResourceListWithAlias(alias: string): Promise<ICompileAssetsList | boolean>;

};