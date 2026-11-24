# Public Pool

## Documentation

- [Public Pool upstream README](https://github.com/benjamin-wilson/public-pool#readme) — the upstream project page, with background on the pool and protocol.

## What you get on StartOS

- A **Web UI** interface — the Public Pool dashboard for watching workers, hashrate, and block discoveries.
- A **Stratum Server** interface — plain TCP on port 3333 and TLS (`stratum+tls`) on port 4333 — the endpoint your mining hardware points at.
- Choose Bitcoin Core, rbitcoin, or Bitcoin Testnet4 as the node supplying block templates. The selected node’s RPC connection is configured for you.
- This package is maintained by [remcoros](https://github.com/remcoros/public-pool-startos/tree/rbitcoin) and uses the `rbitcoin` version flavor. The flavor identifies the package; choose the node separately in Configure.

## Getting set up

1. Install and sync a Bitcoin node. For Bitcoin Core or Bitcoin Testnet4, complete its **Auto Configure** task to enable ZMQ. For rbitcoin, enable **JSON-RPC** in **Client APIs** and generate RPC credentials.
2. Open Public Pool’s **Configure** action and select the installed node under **Bitcoin node**. rbitcoin is the default. When selecting Bitcoin Testnet4, configure miners with a testnet payout address; the pool keeps Testnet4 statistics separate from mainnet. Public Pool connects to the selected node when it is running and ready.
3. Open the **Configure** action and set:
   - **Pool Identifier** — the string that appears in your coinbase transactions (default `Public-Pool on StartOS`).
   - **Server Display URL** — which of the Stratum interface's plain-TCP addresses to show on the dashboard as the connection URL for miners. Defaults to the device's `.local` hostname.
   - **Secure Server Display URL** — which of the Stratum interface's TLS addresses to use for `stratum+tls` connections. Also defaults to `.local`, which has the bonus that the TLS certificate matches the hostname. Note: the currently pinned UI does not display this address on the dashboard, but TLS on port 4333 still works (see **Connecting miners**).
4. Point your mining hardware at the Stratum server. See **Connecting miners** below.

## Using Public Pool

### Web UI

Open the **Web UI** interface from the service page. The dashboard shows pool hashrate, your workers, recent blocks found, and the configured Stratum display URL miners should use.

### Configure action

Run **Configure** whenever you want to switch nodes, change the coinbase pool identifier or pick different Stratum display URLs (for example after adding a new clearnet or LAN address to the Stratum interface).

### Connecting miners

- **Plain TCP** — point your miner at `stratum+tcp://<host>:3333`.
- **TLS** — point your miner at `stratum+tls://<host>:4333`. StartOS terminates the TLS connection and forwards it to the pool.

The dashboard shows the device's `.local` hostname by default. ESP32-based miners like the Bitaxe generally resolve mDNS fine; if yours cannot (stock ASIC firmware often can't), run **Configure** and select the LAN IP instead. Avoid the `.onion` address — mining firmware cannot resolve Tor.

## Limitations

- The TLS certificate on port 4333 is issued by your device's StartOS root CA. Miners that validate certificates need that CA installed (download it from your StartOS dashboard); many ASIC firmwares skip certificate validation or do not support `stratum+tls` at all — plain TCP on 3333 always works.
- The web UI is pinned to a pre-overhaul version while Public Pool's frontend is being rebuilt upstream; some newer dashboard features are not present in this release.
