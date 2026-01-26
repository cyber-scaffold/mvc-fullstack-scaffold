

export interface ResourceManagementInterface {

  checkSourceCodeAndRelation(sourceCodeFilePath: string): Promise<void | boolean>;

  smartDecideWithUniqueAlias(alias: string): Promise<void | boolean>;

  getResourceList(): Promise<any[]>;

};