import React from "react";
import pretty from "pretty";
import { injectable, inject } from "inversify";
import { renderToString } from "react-dom/server";

import { IOCContainer } from "@/main/commons/Application/IOCContainer";
import { MainfastDetail } from "@/main/commons/Application/MainfastDetail";

import { RenderContextProvider } from "@/frameworks/librarys/RenderContext";

type paramsType = {
  title: string,
  keywords?: string[],
  description?: string,
  assets: string,
  content?: any,
  component?: React.Node
};

@injectable()
export class RenderHTMLContentService {

  private defaultTitle = "";

  private defaultKeywords = [];

  /** 需要大于25个字,不然bing这类搜索引擎有可能会报错 **/
  private defaultDescription = "";

  constructor(
    @inject(MainfastDetail) private readonly $MainfastDetail: MainfastDetail
  ) { };

  public async getContentString({ title = this.defaultTitle, description = this.defaultDescription, keywords = this.defaultKeywords, assets, content, component }: paramsType) {
    const RenderComponent = component;
    const mainfast = await this.$MainfastDetail.getMainfastFileContent();
    const SEOInfomation = { title, description };
    const contentString = renderToString(
      <html lang="zh-CN">
        <head>
          <meta charSet="UTF-8" />
          <title>{title}</title>
          <meta name="keywords" content={[...keywords, ...this.defaultKeywords].join(",")} />
          <meta name="description" content={description} />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no" />
          <link href="/statics/favicon.ico" rel="icon" type="image/x-icon" />
          {mainfast[`${assets}.css`] ? (<link rel="stylesheet" href={`/${mainfast[`${assets}.css`]}`} />) : null}
          <script dangerouslySetInnerHTML={{ __html: `window.process=${JSON.stringify({ env: { NODE_ENV: process.env.NODE_ENV } })};` }}></script>
          <script dangerouslySetInnerHTML={{ __html: `window.seo=${JSON.stringify(SEOInfomation, null, "")};` }}></script>
          <script dangerouslySetInnerHTML={{ __html: `window.content=${JSON.stringify(content, null, "")};` }}></script>
        </head>
        <body>
          <div id="root">
            {RenderComponent ? (
              <RenderContextProvider seo={SEOInfomation} content={content}>
                <RenderComponent />
              </RenderContextProvider>
            ) : null}
          </div>
          {mainfast[`${assets}.js`] ? (<script src={`/${mainfast[`${assets}.js`]}`}></script>) : null}
        </body>
      </html>
    );
    return pretty(contentString);
  };

};

IOCContainer.bind(RenderHTMLContentService).toSelf().inRequestScope();