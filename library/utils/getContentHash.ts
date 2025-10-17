import fs from "fs";
import md5 from "md5";
import { promisify } from "util";

/**
 * 采用基于md5的 多熵复合哈希 签名算法最大限度的防止内容碰撞
 * **/
export async function getContentHash(sourceCodeFilePath: string): Promise<string> {
  const sourceCodeContent: string = await promisify(fs.readFile)(sourceCodeFilePath, "utf-8");
  const multiEntropyCompositeHashing: string = md5(sourceCodeContent + md5(sourceCodeContent))
  return multiEntropyCompositeHashing
};