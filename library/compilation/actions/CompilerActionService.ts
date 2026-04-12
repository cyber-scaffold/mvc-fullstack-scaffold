import fs from "fs";
import { promisify } from "util";
import pathExists from "path-exists";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/library/compilation/cores/IOCContainer";
import { CompilationConfigManager } from "@/library/compilation/commons/CompilationConfigManager";

@injectable()
export class CompilerActionService {

  constructor (
    @inject(CompilationConfigManager) private readonly $CompilationConfigManager: CompilationConfigManager
  ) { };

  /**
   * 清理编译目录
   * **/
  public async initialize() {
    const { assetsDirectoryPath } = await this.$CompilationConfigManager.getRuntimeConfig();
    // if (await pathExists(assetsDirectoryPath)) {
    //   return false;
    // };
    await promisify(fs.mkdir)(assetsDirectoryPath, { recursive: true });
  };

};

IOCContainer.bind(CompilerActionService).toSelf().inRequestScope();