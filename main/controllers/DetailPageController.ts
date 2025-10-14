import { Router, Request } from "express";
import { injectable, inject } from "inversify";

import { responseHtmlWrapper } from "@/frameworks/librarys/responseHtmlWrapper";

import { IOCContainer } from "@/main/commons/Application/IOCContainer";
import { RenderHTMLContentService } from "@/main/services/RenderHTMLContentService";
import { DetailPage } from "@/main/views/pages/DetailPage";

@injectable()
export class DetailPageController {

  constructor(
    @inject(RenderHTMLContentService) private readonly $RenderHTMLContentService: RenderHTMLContentService
  ) { };

  public getRouter() {
    return Router().get("/detail", responseHtmlWrapper(async (request: Request) => {
      return await this.execute(request);
    }));
  };

  public async execute(request: Request): Promise<any> {
    const renderContent = await this.$RenderHTMLContentService.getContentString({
      title: "详情页",
      assets: "detail",
      component: DetailPage,
      content: {}
    });
    return renderContent;
  };

};

IOCContainer.bind(DetailPageController).toSelf().inRequestScope();