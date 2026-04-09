import { Router, Request } from "express";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/main/server/cores/IOCContainer";
import { responseHtmlWrapper } from "@/main/server/utils/responseHtmlWrapper";
import { renderHTMLContent } from "@/main/server/utils/renderHTMLContent";


@injectable()
export class DetailPageController {

  /** 注册路由的方法 **/
  public getRouter() {
    return Router().get("/detail", responseHtmlWrapper(async (request: Request) => {
      return await this.execute(request);
    }));
  };

  /** 路由的业务逻辑 **/
  public async execute(request: Request): Promise<any> {
    return await renderHTMLContent({
      resource: "DetailPage",
      title: "详情页",
      keywords: [],
      description: "这是详情页",
      content: {}
    });
  };

};

IOCContainer.bind(DetailPageController).toSelf().inRequestScope();