import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { Application } from "@/main/views/Application";

createRoot(document.getElementById("root")).render((
  <BrowserRouter>
    <Application />
  </BrowserRouter>
));