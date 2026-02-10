import fs from "fs";
import path from "path";
import { promisify } from "util";
// import pathExists from "path-exists";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/library/commons/IOCContainer";
import { RuntimeConfigManager } from "@/library/commons/RuntimeConfigManager";
import { filePathContentHash } from "@/library/utils/filePathContentHash";

@injectable()
export class HydrationRenderWapperService {

  constructor(
    @inject(RuntimeConfigManager) private readonly $RuntimeConfigManager: RuntimeConfigManager
  ) { };

  /**
   * 包装渲染函数的方法
   * **/
  private wapperTemplate(sourceCodeFilePath: string): string {
    return `
      //@ts-nocheck
      import React from "react";
      import { createRoot } from "react-dom/client";
      import RenderElement from "${sourceCodeFilePath}";

      declare global {
        interface Window {
          meta: {
            title: string;
            description: string;
            keywords: string;
          };
          process: any
          content: any
        }
      };

      export default function renderHydration(rootElement,options){
        createRoot(rootElement).render(<RenderElement meta={options.meta} process={options.process} content={options.content} />);
      };
    `
  };

  /**
   * 对export default的组件做一个渲染到document的wapper并生成临时文件,返回临时文件作为webpack的编译入口
   * **/
  public async generateStandardizationHydrationFile(sourceCodeFilePath: string): Promise<string> {
    const { standardizationHydrationTempDirectoryPath } = await this.$RuntimeConfigManager.getRuntimeConfig();
    const composeTemporaryRenderFilePath = path.join(standardizationHydrationTempDirectoryPath, `${filePathContentHash(sourceCodeFilePath)}.tsx`);
    await promisify(fs.writeFile)(composeTemporaryRenderFilePath, this.wapperTemplate(sourceCodeFilePath));
    return composeTemporaryRenderFilePath;
  };

};


IOCContainer.bind(HydrationRenderWapperService).toSelf().inRequestScope();

