/** 基于JavaScript序言指令将该文件输出为指定的客户端渲染文件 **/
"client-assets-filename=search";

import React from "react";

import { renderToDocument } from "@/frameworks/librarys/renderToDocument";
import { useRenderContext } from "@/frameworks/librarys/RenderContext";
import { BasicLayout } from "@/www/layouts/BasicLayout";


export function SearchPage(props) {
  const { content } = useRenderContext();
  return (
    <BasicLayout>
      <div>这是搜索的结果页</div>
      <div>
        {content.list.map((fill, index) => {
          return <div key={fill + index}>index</div>
        })}
      </div>
      <a href="/">回到主页</a>
    </BasicLayout>
  )
};

renderToDocument(SearchPage);