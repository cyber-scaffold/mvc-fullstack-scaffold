/** 基于JavaScript序言指令将该文件输出为指定的客户端渲染文件 **/
"client-assets-filename=search";

import React from "react";
import { renderToDocument } from "@/www/utils/renderToDocument";

export function SearchPage(props) {
  return (
    <div>
      <div>这是搜索的结果页</div>
    </div>
  )
};


SearchPage.propTypes = {

};

// renderToDocument(SearchPage);