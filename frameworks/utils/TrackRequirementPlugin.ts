import fs from "fs";
import path from "path";
import { promisify } from "util";

/**
 * 跟踪出被引用到的客户端组件,并生成清单,
 * 根据清单生成临时的wapper清单到临时文件夹,前端编译框架监听这个临时文件
 * 后续webpack也按照原有的目录结构进行输出
 * **/
export class TrackRequirementPlugin {
  apply(compiler) {
    compiler.hooks.done.tap("CollectUsedComponents", async (stats) => {
      const modules = stats.toJson({ all: false, modules: true }).modules || [];
      const usedComponents = modules.map((everyModule) => {
        if (!everyModule.name) {
          return false
        };
        if (everyModule.name.match(/\/views\/pages/ig) && everyModule.name.match(/\.{ts|tsx|js|jsx}/)) {
          return everyModule.name;
        };
        return false;
      }).filter(Boolean);
      console.log("使用到了以下组件====>", usedComponents);
      // await promisify(fs.writeFile)(path.resolve());
    });
  }
};