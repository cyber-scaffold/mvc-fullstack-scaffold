import { Router, Request } from "express";
import { injectable, inject } from "inversify";

import { responseHtmlWrapper } from "@/frameworks/librarys/responseHtmlWrapper";

import { IOCContainer } from "@/main/commons/Application/IOCContainer";
import { RenderHTMLContentService } from "@/main/services/RenderHTMLContentService";
import { IndexPage } from "@/www/pages/IndexPage";


@injectable()
export class IndexPageController {

  constructor(
    @inject(RenderHTMLContentService) private readonly $RenderHTMLContentService: RenderHTMLContentService
  ) { };

  public getRouter() {
    return Router().get("/", responseHtmlWrapper(async (request: Request) => {
      return await this.execute(request);
    }));
  };

  public async execute(request: Request): Promise<any> {
    const renderContent = await this.$RenderHTMLContentService.getContentString({
      title: "主页",
      assets: "home",
      component: IndexPage,
      content: { list: Array(40).fill(1) }
    });
    return renderContent;
  };

};

IOCContainer.bind(IndexPageController).toSelf().inRequestScope();