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
  "zmq-enabled": {
    "type": "boolean",
    "name": "Use ZeroMQ (recommended)",
    "description":
      "Use ZeroMQ for new block notifications, this is generally faster than polling over RPC",
    "default": true,
  },
  "rpc-timeout": {
    "type": "number",
    "name": "RPC Timeout",
    "description":
      "RPC Timeout in milliseconds. Increase this when public-pool crashes with RPC timeout errors",
    "default": 10000,
    "integral": true,
    "nullable": true,
    "units": "milliseconds",
    "range": "[1000,300000]",
  },
  "pool-identifier": {
    "type": "string",
    "name": "Pool Identifier",
    "description":
      "The pool identifier to include in the Coinbase transactions",
    "copyable": true,
    "default": "Public-Pool",
    "placeholder": "Public-Pool",
    "pattern": ".*",
    "pattern-description": "any string",
    "nullable": true,
  },
  "pool-address": {
    "type": "string",
    "name": "Server IP/hostname (on homepage)",
    "description":
      "The IP address or hostname to show on the public-pool homepage",
    "copyable": true,
    "placeholder": "<StartOS Server IP>",
    "nullable": true,
    "pattern": ".*",
    "pattern-description": "Server IP or hostname",
  },
});
