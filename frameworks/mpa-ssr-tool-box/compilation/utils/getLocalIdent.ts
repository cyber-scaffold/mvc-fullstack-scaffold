import { v4 as uuid } from "uuid";
import type { LoaderContext } from "webpack";

export function getLocalIdent(context: LoaderContext<{}>, localIdentName: string, localName: string): string {
  return `${localName}-${uuid()}`;
};