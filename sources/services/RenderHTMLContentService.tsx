import React from "react";
import { injectable, inject } from "inversify";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";

import { IOCContainer } from "@/sources/applications/IOCContainer";
import { MainfastDetail } from "@/sources/applications/MainfastDetail";
import { Application } from "@/sources/views/Application";

type paramsType = {
  title: string,
  location: string,
  content?: any
};

@injectable()
export class RenderHTMLContentService {

  constructor(
    @inject(MainfastDetail) private readonly $MainfastDetail: MainfastDetail
  ) { };

  public async getContentString({ title, location, content }: paramsType) {
    const mainfast = await this.$MainfastDetail.getMainfastFileContent();
    const contentString = renderToString(
      <html>
        <head>
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no" />
          <title>{title}</title>
          <link href="/favicon.ico" />
          {mainfast["main.css"] ? (<link rel="stylesheet" href={`/${mainfast["main.css"]}`} />) : null}
          <script dangerouslySetInnerHTML={{ __html: `window.process=${JSON.stringify({ env: { NODE_ENV: process.env.NODE_ENV } })};` }}></script>
          <script dangerouslySetInnerHTML={{ __html: `window.initial_value=${JSON.stringify(content, null, "")};` }}></script>
        </head>
        <body>
          <div id="root">
            <StaticRouter location={location}>
              <Application />
            </StaticRouter>
          </div>
          {mainfast["vendors.js"] ? (<script src={`/${mainfast["vendors.js"]}`}></script>) : null}
          {mainfast["main.js"] ? (<script src={`/${mainfast["main.js"]}`}></script>) : null}
        </body>
      </html>
    );
    return contentString;
  };

};

IOCContainer.bind(RenderHTMLContentService).toSelf().inRequestScope();