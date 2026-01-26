import path from "path";
import { writeFile } from "jsonfile";
import { injectable, inject } from "inversify";
import swaggerJSDocGenerater from "swagger-jsdoc";

import { IOCContainer } from "@/frameworks/commons/IOCContainer";
import { FrameworkConfigManager } from "@/frameworks/commons/FrameworkConfigManager";

@injectable()
export class GenerateSwaggerDocsService {

  constructor(
    @inject(FrameworkConfigManager) private readonly $FrameworkConfigManager: FrameworkConfigManager
  ) { };

  public async execute() {
    const { staticDestinationDirectoryPath, extractSwaggerGlobExpression } = this.$FrameworkConfigManager.getRuntimeConfig();
    const destnationFilename = path.resolve(staticDestinationDirectoryPath, "./swagger.json");
    const swagger_api_docs = swaggerJSDocGenerater({
      definition: {
        openapi: "3.0.0",
        info: {
          title: "SwaggerAPI文档",
          version: "1.0.0",
        },
      },
      apis: [extractSwaggerGlobExpression],
    });
    await writeFile(destnationFilename, swagger_api_docs, { spaces: 2, EOL: "\r\n" });
  };

};

IOCContainer.bind(GenerateSwaggerDocsService).toSelf().inRequestScope();

