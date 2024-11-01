import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route } from "react-router-dom";

import { KeepAlive } from "@/sources/views/components/KeepAlive";
import { BasicLayout } from "@/sources/views/layouts/BasicLayout";
import { HomePage } from "@/sources/views/pages/HomePage";
import { InfoPage } from "@/sources/views/pages/InfoPage";


createRoot(document.getElementById("root")).render((
  <BrowserRouter>
    <BasicLayout navigations={[{ name: "主页", value: "home" }, { name: "信息页", value: "info" }]}>
      <Route path="/home">
        {({ match }) => <KeepAlive match={match} component={HomePage} />}
      </Route>
      <Route path="/info">
        {({ match }) => <KeepAlive match={match} component={InfoPage} />}
      </Route>
    </BasicLayout>
  </BrowserRouter>
));