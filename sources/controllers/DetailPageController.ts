import { Router, Request } from "express";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/sources/applications/IOCContainer";

import { RenderHTMLContentService } from "@/sources/services/RenderHTMLContentService";
import { responseHtmlWrapper } from "@/sources/utils/responseHtmlWrapper";

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
      location: "/detail",
      content: {}
    });
    return renderContent;
  };

};

IOCContainer.bind(DetailPageController).toSelf().inRequestScope();