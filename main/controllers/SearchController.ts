import { Router, Request } from "express";
import { injectable, inject } from "inversify";

import { responseHtmlWrapper } from "@/frameworks/librarys/responseHtmlWrapper";

import { IOCContainer } from "@/main/commons/Application/IOCContainer";
import { RenderHTMLContentService } from "@/main/services/RenderHTMLContentService";
import { SearchPage } from "@/www/pages/SearchPage";

export const router = Router().get("/search", responseHtmlWrapper(async (request: Request) => {
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
      assets: "search",
      component: SearchPage,
      content: { list: Array(10).fill(1) }
    });
    return renderContent;
  };

};

IOCContainer.bind(SearchController).toSelf().inRequestScope();