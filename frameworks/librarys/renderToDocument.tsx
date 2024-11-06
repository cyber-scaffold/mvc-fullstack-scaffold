import React from "react";
import { createRoot } from "react-dom/client";

import { RenderContextProvider } from "@/frameworks/librarys/RenderContext";

export function renderToDocument(RenderElement: React.Element) {
  /** 一定要记得屏蔽服务端渲染,不然会报document对象不存在的错误 **/
  if (process.isServer) {
    return false;
  };
  createRoot(document.getElementById("root")).render(
    <RenderContextProvider seo={window.seo} content={window.content}>
      <RenderElement />
    </RenderContextProvider>
  );
};