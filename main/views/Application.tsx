import React from "react";
import { Routes, Route } from "react-router-dom";

import { BasicLayout } from "@/main/views/layouts/BasicLayout";
import { IndexPage } from "@/main/views/pages/IndexPage";
import { DetailPage } from "@/main/views/pages/DetailPage";
import { SearchPage } from "@/main/views/pages/SearchPage";

export function Application() {
  return (
    <BasicLayout>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/detail" element={<DetailPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </BasicLayout>
  )
};
