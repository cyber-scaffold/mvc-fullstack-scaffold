import vm from "vm";
import fs from "fs";
import path from "path";
import React from "react";
import Module from "module";
import { promisify } from "util";
import { renderToString } from "react-dom/server";


/**
 * 基于nodejs的vm模块加载脱水渲染函数
 * **/
export async function renderDehydratedResourceWithSandbox(resourceFilePath: string, content?: any) {
  const resourceFileCode = await promisify(fs.readFile)(resourceFilePath, "utf-8");
  const requireRromProject: NodeJS.Require = Module.createRequire(path.resolve(process.cwd(), "./package.json"));
  const sandbox = {
    module: { exports: {} },
    exports: {},
    process: {
      NODE_ENV: process.env.NODE_ENV
    },
    require: requireRromProject,
    __dirname: path.dirname(resourceFilePath),
    __filename: resourceFilePath,
    console
  };
  vm.createContext(sandbox);
  vm.runInContext(resourceFileCode, sandbox, { filename: resourceFilePath });
  const moduleExportInfo = (sandbox.module.exports as any);
  if (moduleExportInfo.default) {
    return renderToString(React.createElement(moduleExportInfo.default, {
      content,
      process: {
        env: { NODE_ENV: process.env.NODE_ENV }
      }
    }));
  };
  return false;
};