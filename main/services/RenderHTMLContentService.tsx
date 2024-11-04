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

  constructor(
    @inject(MainfastDetail) private readonly $MainfastDetail: MainfastDetail
  ) { };

  public async getContentString({ title, assets, content, component }: paramsType) {
    const RenderComponent = component;
    const mainfast = this.$MainfastDetail.getMainfastFileContent();
    const contentString = renderToString(
      <html lang="zh-CN">
        <head>
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no" />
          <link href="/statics/favicon.ico" rel="icon" type="image/x-icon" />
          <title>{title}</title>
          {mainfast[`${assets}.css`] ? (<link rel="stylesheet" href={`/${mainfast[`${assets}.css`]}`} />) : null}
          <script dangerouslySetInnerHTML={{ __html: `window.process=${JSON.stringify({ env: { NODE_ENV: process.env.NODE_ENV } })};` }}></script>
          <script dangerouslySetInnerHTML={{ __html: `window.content=${JSON.stringify(content, null, "")};` }}></script>
        </head>
        <body>
          <div id="root">
            {RenderComponent ? (
              <RenderContextProvider content={content}>
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