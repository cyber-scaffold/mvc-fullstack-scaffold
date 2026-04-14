import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/mpa-ssr-tool-box/runtime/cores/IOCContainer";
import { RuntimeMaterielResourceDatabaseManager } from "@/frameworks/mpa-ssr-tool-box/runtime/commons/RuntimeMaterielResourceDatabaseManager";

import type { MaterielRenderType } from "@/frameworks/mpa-ssr-tool-box/compilation/commons/CompilationConfigManager";

export type MaterielsSummaryQueryResult = MaterielRenderType | false;

/**
 * 物料概览的资源管理器
 * **/
@injectable()
export class ResourceSummaryManagement {

  constructor (
    @inject(RuntimeMaterielResourceDatabaseManager) private readonly $RuntimeMaterielResourceDatabaseManager: RuntimeMaterielResourceDatabaseManager,
  ) { }

  /**
   * 获取注水渲染时涉及到的资源
   * **/
  public async getSummaryDetailByAlias(alias: string): Promise<MaterielsSummaryQueryResult> {
    const summaryDatabase = this.$RuntimeMaterielResourceDatabaseManager.getSummaryDatabase();
    await summaryDatabase.read();
    if (!summaryDatabase.data) {
      return false;
    };
    const summaryByAliasInfo = summaryDatabase.data[alias];
    return summaryByAliasInfo;
  };

};

IOCContainer.bind(ResourceSummaryManagement).toSelf().inRequestScope();
