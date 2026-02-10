import React from "react";

import { BasicLayout } from "@/main/views/layouts/BasicLayout";


export default function DetailPage(props) {
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