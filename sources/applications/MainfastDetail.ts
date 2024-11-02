import path from "path";
import { readFile } from "jsonfile";
import { injectable } from "inversify";

import { IOCContainer } from "@/sources/applications/IOCContainer";

@injectable()
export class MainfastDetail {

  /**
   * 项目的基准目录
   * **/
  public projectDirectory = path.join(path.dirname(__filename), "applications");

  /**
   * 定位 mainfast.json 文件的位置
   * **/
  private mainfastFilePath = path.resolve(this.projectDirectory, "./assets-manifest.json");

  /**
   * 获取编译完成后的资源信息
   * **/
  public async getMainfastFileContent() {
    const mainfastContent = await readFile(this.mainfastFilePath);
    return mainfastContent;
  };

};

IOCContainer.bind(MainfastDetail).toSelf().inSingletonScope();