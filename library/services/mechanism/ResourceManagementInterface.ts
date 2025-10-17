

export interface ResourceManagementInterface {

  relationSourceCode(sourceCodeFilePath: string): Promise<void | boolean>;

  smartDecide(): Promise<void | boolean>;

  getResourceList(): Promise<any[]>;

};