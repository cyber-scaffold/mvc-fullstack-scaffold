/** 基于JavaScript序言指令将该文件输出为指定的客户端渲染文件 **/
"client-assets-filename=detail";

import React from "react";

import { renderToDocument } from "@/frameworks/librarys/renderToDocument";
import { BasicLayout } from "@/main/views/layouts/BasicLayout";

export function DetailPage(props) {
  return (
    <BasicLayout>
      <div>这是详情页</div>
      <div>this is a detail page</div>
      <form action="/search" method="get" encType="application/x-www-form-urlencoded">
        <input type="text" name="keyword" defaultValue="test word" />
        <input type="submit" defaultValue="submit" />
      </form>
    </BasicLayout>
  )
};

renderToDocument(DetailPage);
