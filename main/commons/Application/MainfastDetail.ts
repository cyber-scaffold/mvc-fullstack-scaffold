import path from "path";
import { readFile } from "jsonfile";
import { injectable } from "inversify";

import { IOCContainer } from "@/main/commons/Application/IOCContainer";

@injectable()
export class MainfastDetail {

  /**
   * 项目的基准目录
   * **/
  public projectDirectory = path.join(path.dirname(__filename), "www");

  /**
   * 定位 mainfast.json 文件的位置
   * **/
  private mainfastFilePath = path.resolve(this.projectDirectory, "./assets-manifest.json");

  /**
   * mainfast文件中的资源详情缓存
   * **/
  private mainfastContent: any;

  /**
   * 在服务启动的时候进行一次初始化进行资源寻址
   * **/
  public async initialize() {
    this.mainfastContent = await readFile(this.mainfastFilePath);
  };

  /**
   * 获取编译完成后的资源信息
   * **/
  public getMainfastFileContent() {
    return this.mainfastContent;
  };

};

IOCContainer.bind(MainfastDetail).toSelf().inSingletonScope();