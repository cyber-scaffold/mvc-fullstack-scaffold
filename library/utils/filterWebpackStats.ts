import path from "path";
import type { StatsCompilation } from "webpack";

export function filterWebpackStats(statsJson: StatsCompilation) {
  const { outputPath, assetsByChunkName: { main = [] } } = statsJson;
  const composeAssetsList = {
    "javascript": [],
    "stylesheet": []
  };
  main.forEach((everyAssetsFileName: string) => {
    /** 过滤掉sourcemap文件 **/
    if (everyAssetsFileName.match(/\.(map)$/ig)) {
      return false;
    };
    /** 分析出javascript文件 **/
    if (everyAssetsFileName.match(/\.(js)$/ig)) {
      composeAssetsList["javascript"].push(path.join(outputPath, everyAssetsFileName));
    };
    /** 分析出css文件 **/
    if (everyAssetsFileName.match(/\.(css)$/ig)) {
      composeAssetsList["stylesheet"].push(path.join(outputPath, everyAssetsFileName));
    };
    return false;
  });
  return composeAssetsList;
};