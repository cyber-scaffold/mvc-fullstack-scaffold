import { get } from "dot-prop";;
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/library/compilation/cores/IOCContainer";
import { CompilationConfigManager } from "@/library/compilation/commons/CompilationConfigManager";

import { filePathContentHash } from "@/library/public/filePathContentHash";
import { flatMaterielInfo } from "@/library/public/flatMaterielInfo";

@injectable()
export class FileLoaderConfigManager {

  constructor (
    @inject(CompilationConfigManager) private readonly $CompilationConfigManager: CompilationConfigManager
  ) { };

  public async getHydrationSiderLoaderConfig() {
    const { fileResourceDirectoryName, materielArrayList } = this.$CompilationConfigManager.getRuntimeConfig();
    // const hydrationInfoByAlias = get(flatMaterielInfo(materielArrayList), [alias, "hydrate"].join("."));
    // let emitFile = true;
    // /** 除非没有注水渲染需求,否则必须生成文件 **/
    // if (!hydrationInfoByAlias) {
    //   emitFile = false;
    // };
    return [{
      test: /\.(ico|png|jpg|jpeg|gif|mp3|mp4|avi|svg|ttf|eot|otf|fon|ttc|woff|woff2)$/,
      use: [{
        loader: "file-loader",
        options: {
          emitFile: true,
          outputPath: `../${fileResourceDirectoryName}/`,
          publicPath: `/${fileResourceDirectoryName}/`,
          name: (resourcePath: string) => {
            return `[name]-${filePathContentHash(resourcePath)}-[contenthash].[ext]`;
          }
        }
      }]
    }]
  };

  public async getDehydrationSiderLoaderConfig() {
    const { fileResourceDirectoryName, materielArrayList } = this.$CompilationConfigManager.getRuntimeConfig();
    // const hydrationInfoByAlias = get(flatMaterielInfo(materielArrayList), [alias, "hydrate"].join("."));
    // const dehydrateInfoByAlias = get(flatMaterielInfo(materielArrayList), [alias, "dehydrate"].join("."));
    // let emitFile = true;
    // /** 如果有注水资源的话就不生成文件,否则就按照脱水需求进行判断 **/
    // if (hydrationInfoByAlias) {
    //   emitFile = false;
    // } else {
    //   emitFile = Boolean(dehydrateInfoByAlias);
    // };
    return [{
      test: /\.(ico|png|jpg|jpeg|gif|mp3|mp4|avi|svg|ttf|eot|otf|fon|ttc|woff|woff2)$/,
      use: [{
        loader: "file-loader",
        options: {
          emitFile: true,
          outputPath: `../${fileResourceDirectoryName}/`,
          publicPath: `/${fileResourceDirectoryName}/`,
          name: (resourcePath: string) => {
            return `[name]-${filePathContentHash(resourcePath)}-[contenthash].[ext]`;
          }
        }
      }]
    }]
  };

};

IOCContainer.bind(FileLoaderConfigManager).toSelf().inSingletonScope();