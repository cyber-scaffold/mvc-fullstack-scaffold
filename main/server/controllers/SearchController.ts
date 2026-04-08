import { Router, Request } from "express";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/main/server/commons/Application/IOCContainer";
import { responseHtmlWrapper } from "@/main/server/utils/responseHtmlWrapper";
import { renderHTMLContent } from "@/main/server/utils/renderHTMLContent";

@injectable()
export class SearchController {

  /** 注册路由的方法 **/
  public getRouter() {
    return Router().get("/search", responseHtmlWrapper(async (request: Request) => {
      return await this.execute(request);
    }));
  };

  /** 路由的业务逻辑 **/
  public async execute(request: Request): Promise<any> {
    console.log("request.query", request.query);
    console.log("request.body", request.body);
    const content = { list: Array(10).fill(1) };
    return await renderHTMLContent({
      resource: "SearchPage",
      title: "搜索结果页",
      keywords: [],
      description: "",
      content: content
    });
  };

};

IOCContainer.bind(SearchController).toSelf().inRequestScope();