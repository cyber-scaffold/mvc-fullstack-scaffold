import fs from "fs";
import pathExists from "path-exists";
import { promisify } from "util";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/frameworks/configs/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/configs/FrameworkConfigManager";

@injectable()
export class CompilerActionService {

  constructor(
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager
  ) { };

  /**
   * 清理编译目录
   * **/
  public async cleanDestnation() {
    const { destnation } = this.$FrameworkConfigManager.getRuntimeConfig();
    if (!await pathExists(destnation)) {
      return false;
    };
    await promisify(fs.rm)(destnation, { recursive: true });
  };

};

IOCContainer.bind(CompilerActionService).toSelf().inRequestScope();