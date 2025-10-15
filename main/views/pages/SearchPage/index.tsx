import React from "react";

import { renderToDocument } from "@/frameworks/librarys/renderToDocument";
import { useRenderContext } from "@/frameworks/librarys/RenderContext";
import { BasicLayout } from "@/main/views/layouts/BasicLayout";


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