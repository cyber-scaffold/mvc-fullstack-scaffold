import fs from "fs";
import pathExists from "path-exists";
import { promisify } from "util";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/commons/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";

@injectable()
export class CompilerActionService {

  constructor(
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager
  ) { };

  /**
   * 清理编译目录
   * **/
  public async cleanDestnation() {
    const { assetsDirectoryPath } = this.$FrameworkConfigManager.getRuntimeConfig();
    if (!await pathExists(assetsDirectoryPath)) {
      return false;
    };
    await promisify(fs.rm)(assetsDirectoryPath, { recursive: true });
  };

};

IOCContainer.bind(CompilerActionService).toSelf().inRequestScope();