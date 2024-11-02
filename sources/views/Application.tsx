import React from "react";
import { Routes, Route } from "react-router-dom";

import { BasicLayout } from "@/sources/views/layouts/BasicLayout";
import { IndexPage } from "@/sources/views/pages/IndexPage";
import { DetailPage } from "@/sources/views/pages/DetailPage";

export function Application() {
  return (
    <BasicLayout>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/detail" element={<DetailPage />} />
      </Routes>
    </BasicLayout>
  )
};
