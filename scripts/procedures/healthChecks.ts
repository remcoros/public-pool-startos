import { types as T, healthUtil } from "../deps.ts";

export const health: T.ExpectedExports.health = {
  "web-ui": healthUtil.checkWebUrl("http://public-pool.embassy:80")
}
