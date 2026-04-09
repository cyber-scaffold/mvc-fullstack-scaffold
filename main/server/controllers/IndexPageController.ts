import { Router, Request } from "express";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/main/server/cores/IOCContainer";
import { responseHtmlWrapper } from "@/main/server/utils/responseHtmlWrapper";
import { renderHTMLContent } from "@/main/server/utils/renderHTMLContent";


@injectable()
export class IndexPageController {

  /** 注册路由的方法 **/
  public getRouter() {
    return Router().get("/", responseHtmlWrapper(async (request: Request) => {
      return await this.execute(request);
    }));
  };

  /** 路由的业务逻辑 **/
  public async execute(request: Request): Promise<any> {
    const content = { list: Array(10).fill(1).map((fill, index) => fill + index) };
    return await renderHTMLContent({
      resource: "IndexPage",
      title: "主页",
      keywords: [],
      description: "",
      content: content
    });
  };

};

IOCContainer.bind(IndexPageController).toSelf().inRequestScope();