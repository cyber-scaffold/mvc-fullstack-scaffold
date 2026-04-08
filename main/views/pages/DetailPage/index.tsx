import React from "react";

import { BasicLayout } from "@/main/views/layouts/BasicLayout";


export default function DetailPage(props) {
  return (
    <BasicLayout>
      <div style={{ textAlign: "center", color: "#FFFFFF" }}>
        <div>这是详情页</div>
        <div>this is a detail page</div>
        <form action="/search" method="get" encType="application/x-www-form-urlencoded">
          <input type="text" name="keyword" defaultValue="test word" style={{ fontSize: 24 }} />
          <input type="submit" defaultValue="submit" style={{ fontSize: 24 }} />
        </form>
      </div>
    </BasicLayout>
  )
};