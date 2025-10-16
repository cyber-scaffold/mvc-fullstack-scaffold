import { Router, Request } from "express";
import { injectable, inject } from "inversify";

import { responseHtmlWrapper } from "@/frameworks/librarys/responseHtmlWrapper";

import { IOCContainer } from "@/main/server/commons/Application/IOCContainer";
import { RenderHTMLContentService } from "@/main/server/services/RenderHTMLContentService";
// import { UserPage } from "@/main/views/pages/UserPage";

@injectable()
export class UserPageController {

  constructor(
    @inject(RenderHTMLContentService) private readonly $RenderHTMLContentService: RenderHTMLContentService
  ) { };

  public getRouter() {
    return Router().get("/user", responseHtmlWrapper(async (request: Request) => {
      return await this.execute(request);
    }));
  };

  public async execute(request: Request): Promise<any> {
    // const renderContent = await this.$RenderHTMLContentService.getContentString({
    //   title: "用户中心",
    //   assets: {
    //     stylesheet: "/pages/UserPage/index.css",
    //     javascript: "/pages/UserPage/index.js"
    //   },
    //   component: UserPage,
    //   content: {}
    // });
    // return renderContent;
  };

};

IOCContainer.bind(UserPageController).toSelf().inRequestScope();