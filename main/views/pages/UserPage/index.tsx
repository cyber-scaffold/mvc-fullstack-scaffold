import React from "react";

import { renderToDocument } from "@/frameworks/librarys/renderToDocument";
import { BasicLayout } from "@/main/views/layouts/BasicLayout";

import hq2 from "./assets/hq2.jpg";

export default function UserPage(props) {
  return (
    <BasicLayout>
      <div>这是用户中心</div>
      <div>this is a user page</div>
      <img width={480} height={360} src={hq2} alt="test.png" />
    </BasicLayout>
  )
};

renderToDocument(UserPage);