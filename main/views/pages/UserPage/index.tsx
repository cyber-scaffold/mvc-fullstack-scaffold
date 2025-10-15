import React from "react";

import { renderToDocument } from "@/frameworks/librarys/renderToDocument";
import { BasicLayout } from "@/main/views/layouts/BasicLayout";

export function UserPage(props) {
  return (
    <BasicLayout>
      <div>这是用户中心</div>
      <div>this is a user page</div>
    </BasicLayout>
  )
};

renderToDocument(UserPage);