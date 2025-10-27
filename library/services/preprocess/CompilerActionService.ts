import fs from "fs";
import { promisify } from "util";
import pathExists from "path-exists";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/library/commons/IOCContainer";
import { FrameworkConfigManager } from "@/library/commons/FrameworkConfigManager";

@injectable()
export class CompilerActionService {

  constructor(
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager
  ) { };

  /**
   * 清理编译目录
   * **/
  public async initialize() {
    const { assetsDirectoryPath, tempHydrationDirectoryPath } = await this.$FrameworkConfigManager.getRuntimeConfig();
    if (await pathExists(assetsDirectoryPath)) {
      return false;
    };
    await promisify(fs.mkdir)(assetsDirectoryPath);
    await promisify(fs.mkdir)(tempHydrationDirectoryPath);
  };

};

IOCContainer.bind(CompilerActionService).toSelf().inRequestScope();