import { compat, types as T } from "../deps.ts";

export const getConfig: T.ExpectedExports.getConfig = compat.getConfig({
  "bitcoind": {
    "type": "union",
    "name": "Bitcoin Core",
    "description": "<p>The Bitcoin Core node to connect to</p>",
    "tag": {
      "id": "type",
      "name": "Bitcoin Node Type",
      "variant-names": {
        "mainnet": "Bitcoin Core (mainnet)",
        "testnet": "Bitcoin Core (testnet4)",
      },
      "description": "<p>The Bitcoin Core node to connect to</p>",
    },
    "default": "mainnet",
    "variants": {
      "mainnet": {
        "user": {
          "type": "pointer",
          "name": "RPC Username",
          "description": "The username for Bitcoin Core's RPC interface",
          "subtype": "package",
          "package-id": "bitcoind",
          "target": "config",
          "multi": false,
          "selector": "$.rpc.username",
        },
        "password": {
          "type": "pointer",
          "name": "RPC Password",
          "description": "The password for Bitcoin Core's RPC interface",
          "subtype": "package",
          "package-id": "bitcoind",
          "target": "config",
          "multi": false,
          "selector": "$.rpc.password",
        },
      },
      "testnet": {
        "user": {
          "type": "pointer",
          "name": "RPC Username",
          "description": "The username for Bitcoin Core's RPC interface",
          "subtype": "package",
          "package-id": "bitcoind-testnet",
          "target": "config",
          "multi": false,
          "selector": "$.rpc.username",
        },
        "password": {
          "type": "pointer",
          "name": "RPC Password",
          "description": "The password for Bitcoin Core's RPC interface",
          "subtype": "package",
          "package-id": "bitcoind-testnet",
          "target": "config",
          "multi": false,
          "selector": "$.rpc.password",
        },
      },
    },
  },
});
