import { Router, Request } from "express";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/main/applications/IOCContainer";

import { RenderHTMLContentService } from "@/main/services/RenderHTMLContentService";
import { responseHtmlWrapper } from "@/main/utils/responseHtmlWrapper";

export const router = Router().post("/search", responseHtmlWrapper(async (request: Request) => {
  return await IOCContainer.get(SearchController).execute(request);
}));

@injectable()
export class SearchController {

  constructor(
    @inject(RenderHTMLContentService) private readonly $RenderHTMLContentService: RenderHTMLContentService
  ) { };


  public async execute(request: Request): Promise<any> {
    console.log("request.query", request.query);
    console.log("request.body", request.body);
    const renderContent = await this.$RenderHTMLContentService.getContentString({
      title: "搜索结果页",
      location: "/search",
      content: {}
    });
    return renderContent;
  };

};

IOCContainer.bind(SearchController).toSelf().inRequestScope();