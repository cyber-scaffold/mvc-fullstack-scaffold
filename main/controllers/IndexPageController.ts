import { Router, Request } from "express";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/main/commons/Application/IOCContainer";

import { RenderHTMLContentService } from "@/main/services/RenderHTMLContentService";
import { responseHtmlWrapper } from "@/main/utils/responseHtmlWrapper";

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
      content: { list: [] }
    });
    return renderContent;
  };

};

IOCContainer.bind(IndexPageController).toSelf().inRequestScope();