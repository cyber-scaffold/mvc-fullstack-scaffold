import { Router, Request } from "express";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/sources/applications/IOCContainer";

import { RenderHTMLContentService } from "@/sources/services/RenderHTMLContentService";
import { responseHtmlWrapper } from "@/sources/utils/responseHtmlWrapper";

export const router = Router().get("/", responseHtmlWrapper(async (request: Request) => {
  return await IOCContainer.get(IndexPageController).execute(request);
}));

@injectable()
export class IndexPageController {

  constructor(
    @inject(RenderHTMLContentService) private readonly $RenderHTMLContentService: RenderHTMLContentService
  ) { };

  public async execute(request: Request): Promise<any> {
    const renderContent = await this.$RenderHTMLContentService.getContentString({
      title: "主页",
      location: "/",
      content: {}
    });
    return renderContent;
  };

};

IOCContainer.bind(IndexPageController).toSelf().inRequestScope();