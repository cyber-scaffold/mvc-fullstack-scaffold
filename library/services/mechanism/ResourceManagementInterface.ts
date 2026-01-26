

export interface ResourceManagementInterface {

  checkSourceCodeAndRelation(sourceCodeFilePath: string): Promise<void | boolean>;

  smartDecideWithUniqueAlias(alias: string): Promise<void | boolean>;

  getResourceListWithAlias(alias: string): Promise<any[]>;

};