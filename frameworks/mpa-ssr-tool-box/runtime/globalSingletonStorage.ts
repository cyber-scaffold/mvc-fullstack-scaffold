import { isUndefined } from "lodash";

export class GlobalSingletonStorage {

  private storage: any = {};

  public has(keyName: string) {
    if (isUndefined(this.storage[keyName])) {
      return false;
    };
    return Boolean(this.storage[keyName]);
  };

  public save(keyName: string, value: any) {
    if (this.has(keyName)) {
      throw new Error(`GlobalSingletonStorage ${keyName} = ${this.storage[keyName]} already exist`);
    };
    this.storage[keyName] = value;
  };

  public read(keyName: string) {
    return this.storage[keyName];
  };

};

const globalSingletonStorage = new GlobalSingletonStorage();


export function saveProjectDirectoryAbsolutePath(value: string) {
  globalSingletonStorage.save("PROJECT_DIRECTORY_ABSOLUTE_PATH_AT_RUNTIME", value);
};


export function readProjectDirectoryAbsolutePath(): string {
  return globalSingletonStorage.read("PROJECT_DIRECTORY_ABSOLUTE_PATH_AT_RUNTIME");
};


export function saveProjectEntryFileAbsolutePath(value: string) {
  globalSingletonStorage.save("PROJECT_ENTRY_FILE_ABSOLUTE_PATH_AT_RUNTIME", value);
};


export function readProjectEntryFileAbsolutePath(): string {
  return globalSingletonStorage.read("PROJECT_ENTRY_FILE_ABSOLUTE_PATH_AT_RUNTIME");
};