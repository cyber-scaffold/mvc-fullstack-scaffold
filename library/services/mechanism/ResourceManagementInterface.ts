

export interface ResourceManagementInterface {

  checkSourceCodeAndRelation(sourceCodeFilePath: string): Promise<void | boolean>;

  buildResourceWithUniqueAlias(alias: string): Promise<void | boolean>;

  getResourceListWithAlias(alias: string): Promise<any[]>;

};