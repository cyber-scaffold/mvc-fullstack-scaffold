import { Router, Request } from "express";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/main/commons/Application/IOCContainer";

import { RenderHTMLContentService } from "@/main/services/RenderHTMLContentService";
import { responseHtmlWrapper } from "@/main/utils/responseHtmlWrapper";
import { DetailPage } from "@/www/pages/DetailPage";

export const router = Router().get("/detail", responseHtmlWrapper(async (request: Request) => {
  return await IOCContainer.get(DetailPageController).execute(request);
}));

@injectable()
export class DetailPageController {

  constructor(
    @inject(RenderHTMLContentService) private readonly $RenderHTMLContentService: RenderHTMLContentService
  ) { };

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