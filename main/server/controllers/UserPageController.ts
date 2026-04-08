import { Router, Request } from "express";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/main/server/commons/Application/IOCContainer";
import { responseHtmlWrapper } from "@/main/server/utils/responseHtmlWrapper";
import { renderHTMLContent } from "@/main/server/utils/renderHTMLContent";

@injectable()
export class UserPageController {

  /** 注册路由的方法 **/
  public getRouter() {
    return Router().get("/user", responseHtmlWrapper(async (request: Request) => {
      return await this.execute(request);
    }));
  };

  /** 路由的业务逻辑 **/
  public async execute(request: Request): Promise<any> {
    return await renderHTMLContent({
      resourceAlias: "UserPage",
      meta: {
        title: "用户中心",
        keywords: [],
        description: "",
      },
      content: {}
    });
  };

};

IOCContainer.bind(UserPageController).toSelf().inRequestScope();