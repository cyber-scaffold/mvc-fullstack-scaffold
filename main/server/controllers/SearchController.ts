import { Router, Request } from "express";
import { injectable, inject } from "inversify";

import { responseHtmlWrapper } from "@/frameworks/librarys/responseHtmlWrapper";

import { IOCContainer } from "@/main/server/commons/Application/IOCContainer";
import { RenderHTMLContentService } from "@/main/server/services/RenderHTMLContentService";
// import { SearchPage } from "@/main/views/pages/SearchPage";

@injectable()
export class SearchController {

  constructor(
    @inject(RenderHTMLContentService) private readonly $RenderHTMLContentService: RenderHTMLContentService
  ) { };

  public getRouter() {
    return Router().get("/search", responseHtmlWrapper(async (request: Request) => {
      return await this.execute(request);
    }));
  };

  public async execute(request: Request): Promise<any> {
    // console.log("request.query", request.query);
    // console.log("request.body", request.body);
    // const renderContent = await this.$RenderHTMLContentService.getContentString({
    //   title: "搜索结果页",
    //   assets: {
    //     stylesheet: "/pages/SearchPage/index.css",
    //     javascript: "/pages/SearchPage/index.js"
    //   },
    //   component: SearchPage,
    //   content: { list: Array(10).fill(1) }
    // });
    // return renderContent;
  };

};

IOCContainer.bind(SearchController).toSelf().inRequestScope();