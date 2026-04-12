import { fromPairs } from "lodash";

import type { StatsCompilation } from "webpack";

export type EveryCompileAssetsInfo = {
  javascript: string[]
  stylesheet: string[]
  statics: string[]
};

export type CompileAssetsDictionaryType = {
  [alias: string]: EveryCompileAssetsInfo
};

export function filterWebpackStats(statsJson: StatsCompilation): CompileAssetsDictionaryType {
  const assetsByChunkName: Record<string, string[]> = statsJson.assetsByChunkName;
  return fromPairs(Object.keys(assetsByChunkName).map((everyAssetsId: string) => {
    const composeAssetsList: EveryCompileAssetsInfo = {
      "javascript": [],
      "stylesheet": [],
      "statics": []
    };
    const everyAssetsList: string[] = assetsByChunkName[everyAssetsId];
    everyAssetsList.forEach((everyAssetsFileName) => {
      /** 过滤掉sourcemap文件 **/
      if (everyAssetsFileName.match(/\.(map)$/ig)) {
        return false;
      };
      /** 分析出javascript文件 **/
      if (everyAssetsFileName.match(/\.(js)$/ig)) {
        composeAssetsList["javascript"].push(everyAssetsFileName);
      };
      /** 分析出css文件 **/
      if (everyAssetsFileName.match(/\.(css)$/ig)) {
        composeAssetsList["stylesheet"].push(everyAssetsFileName);
      };
      /** 分析出静态文件 **/
      if (everyAssetsFileName.match(/\.(ico|png|jpg|jpeg|gif|mp3|mp4|avi|svg|ttf|eot|otf|fon|ttc|woff|woff2)$/ig)) {
        composeAssetsList["statics"].push(everyAssetsFileName);
      };
    });
    return [everyAssetsId, composeAssetsList];
  }));
};