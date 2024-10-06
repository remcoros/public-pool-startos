// deno-lint-ignore-file no-explicit-any
import { compat, types as T } from "../deps.ts";

export const migration: T.ExpectedExports.migration = compat.migrations
  .fromMapping({
    "0.2.2": {
      up: compat.migrations.updateConfig(
        (config: any) => {
          config["zmq-enabled"] = true;
          return config;
        },
        true,
        { version: "0.2.2", type: "up" },
      ),
      down: compat.migrations.updateConfig(
        (config: any) => {
          delete config["zmq-enabled"];
          return config;
        },
        true,
        { version: "0.2.2", type: "down" },
      ),
    },
  }, "0.2.4");
