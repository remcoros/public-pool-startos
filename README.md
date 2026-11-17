<p align="center">
  <img src="icon.svg" alt="Public Pool Logo" width="21%">
</p>

# Public Pool on StartOS

> Everything not listed in this document should behave the same as upstream
> Public Pool. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[Public Pool](https://github.com/benjamin-wilson/public-pool) is a solo Bitcoin mining pool server: point your miners at it and they build blocks against your own node, with the full reward going to whoever finds one. This package wires it to the Bitcoin on this server, pins the developer fee to nothing, and shows your miners the address to point at.

- **Upstream repo:** <https://github.com/benjamin-wilson/public-pool>
- **Wrapper repo:** <https://github.com/remcoros/public-pool-startos/tree/rbitcoin>

This custom package uses the `rbitcoin` version flavor and is maintained on the `rbitcoin` branch. Configure still offers both Bitcoin Core and rbitcoin; Bitcoin Core remains the default. It keeps the `public-pool` service ID and can migrate existing unflavored installations through the retained configuration and task-cleanup migrations, preserving their data and settings.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

One image built from source, run twice — once as the stratum server, once as the web UI.

| Property      | Value                   |
| ------------- | ----------------------- |
| Image         | Built from `Dockerfile` |
| Architectures | x86_64, aarch64         |

| Subcontainer | Daemon    | Runs                                            |
| ------------ | --------- | ----------------------------------------------- |
| `stratum`    | `stratum` | The pool server itself — the one to `attach` to |
| `ui`         | `ui`      | nginx serving the built web app                 |

**The UI's Stratum address is patched into the built JavaScript at start.** Upstream bakes a placeholder into its production bundle, and the package substitutes the address you chose before nginx serves it. That substitution is done in Node rather than through a shell `sed`, because the address is user-supplied and both layers would read parts of it as syntax — a lone `/` ends a `sed` expression early, and a quote or `$( )` escapes the shell entirely.

## Volume and Data Layout

One volume, mounted into the stratum container at two points.

| Volume | Mount Point                                       | Purpose                                        |
| ------ | ------------------------------------------------- | ---------------------------------------------- |
| `main` | its `mainnet/` at `/public-pool/DB`               | The pool database: miners, shares, and history |
| `main` | its `.env` at `/public-pool/.env`, read-only file | The pool's configuration                       |

The config is mounted **read-only and as a single file**, so the pool reads its settings but cannot rewrite them. The UI container mounts nothing at all — everything it needs is in the image.

The selected node's data volume is mounted read-only so the pool can read its RPC cookie. For rbitcoin, the cookie is at `datadir/rpc.cookie`; its RPC must be enabled and credentials generated.

## File Models

Two models: the pool's own `.env`, and a store for the selected node and display addresses.

| File         | Format | Modelled                | Written by                                   |
| ------------ | ------ | ----------------------- | -------------------------------------------- |
| `.env`       | env    | Yes — `FileHelper.env`  | Every init, `main`, and the Configure action |
| `store.json` | JSON   | Yes — `FileHelper.json` | Init, and the Configure action               |

**Enforced** — rewritten whenever the package writes: the RPC timeout, the API and stratum ports, the API's plaintext flag, the network and `DEV_FEE_ADDRESS`.

**Derived** — the selected node’s RPC endpoint and cookie path, and the Bitcoin ZMQ endpoint, written by `main` from bridge addresses before the stratum daemon reads the file. Each is a separate reactive subscription, so a bitcoind update or restart does not restart the pool — only an actual address change does.

**Yours** — the node selection, the pool identifier stamped into coinbase transactions, and the two display addresses.

### `DEV_FEE_ADDRESS` is pinned empty, deliberately

Upstream splits the coinbase 1.5% / 98.5% with whatever address this key holds, once a miner is at or above 50 TH/s — and it never checks the value is an address at all, so a junk one makes every job throw.

It is named in the model rather than left out precisely because a file model **preserves keys it does not name**. Left out, a line planted on the volume — by a restored backup, say — would survive every write the package makes. Naming it means each merge coerces it back to empty, and upstream pays the miner 100% when it is empty.

## Dependencies

One of two optional dependencies is active, selected in Configure. Existing installations default to Bitcoin Core.

| Dependency | Kind | Health check | Connection |
| ---------- | ---- | ------------ | ---------- |
| `bitcoind` (Bitcoin Core) | `running` | `bitcoind` | RPC cookie and ZMQ block notifications |
| `rbitcoin` >= 0.9.2:0 | `running` | `rpc` | RPC cookie and 500 ms mining-info polling |

Bitcoin needs ZMQ enabled; a critical task requests it. For rbitcoin, enable JSON-RPC and generate RPC credentials in rbitcoin. Public Pool watches the selected cookie for rotation, and resolves the selected RPC bridge address at startup. It refuses to start when the address cannot be resolved.

## Network Access and Interfaces

Two interfaces on one host, so they can share a domain.

| Interface      | Id        | Type | Port | Description                            |
| -------------- | --------- | ---- | ---- | -------------------------------------- |
| Web UI         | `ui`      | ui   | 80   | Personal web interface for Public Pool |
| Stratum Server | `stratum` | api  | 3333 | Where your miners connect              |

**Stratum is offered plaintext and over TLS**, on separate ports, and the plaintext one stays available on ordinary LAN gateways rather than being replaced by the TLS one. That is deliberate: most mining hardware speaks plain stratum only.

**The address your miners use is not necessarily the one the UI shows.** The UI's displayed address is a separate setting, seeded from the `.local` hostname and changeable in Configure — it is what the pool's homepage tells people to point at.

## Installation and First-Run Flow

Install seeds the config and picks display addresses from the `.local` hostname, falling back to a private LAN address. For Bitcoin, a critical task requests ZMQ. For rbitcoin, enable JSON-RPC and generate credentials in rbitcoin.

Once the selected node is configured and synced, point a miner at the stratum address using **your own Bitcoin address as the username** — that is how Public Pool identifies a miner and where a found block pays out. Nothing on this side needs a credential.

## Actions

One action.

### Configure

The node implementation, pool identifier, and plain and TLS stratum addresses for the web UI to display. The pinned UI shows only the plain one; the TLS one is stored for a later UI (see `UPDATING.md`).

- **What it changes:** `POOL_IDENTIFIER` in `.env`, and both display addresses in `store.json`.
- **Cost:** seconds, then a restart.
- **Repeat safety:** idempotent; the form is pre-filled, and the address dropdowns are built from what the interface actually publishes.
- **The pool identifier goes into every coinbase transaction** the pool builds, so it is public on-chain if you find a block.
- **Changing a display address changes what the homepage advertises**, not where the server listens. Miners already pointed somewhere valid keep working.

## Tasks

One task, and it is on Bitcoin rather than here.

| Task                     | On         | Severity   | Raised when                       | Cleared when             |
| ------------------------ | ---------- | ---------- | --------------------------------- | ------------------------ |
| Bitcoin's Auto-Configure | `bitcoind` | `critical` | Bitcoin is selected and does not have ZMQ enabled | Bitcoin's settings match |

Registered so it re-raises if Bitcoin's configuration later stops matching — for example after restoring Bitcoin from a backup taken without ZMQ. For rbitcoin, the pool polls instead of using ZMQ.

## Health Checks

Two checks, one per daemon, and they are independent — the UI does not wait on the pool.

| Check     | Displayed        | Method                 | Grace |
| --------- | ---------------- | ---------------------- | ----- |
| `stratum` | "Stratum Server" | Port 3333 is listening | 15 s  |
| `ui`      | "Web Interface"  | Port 80 is listening   | —     |

A `stratum` failure after the grace period is the pool itself: most often Bitcoin's RPC refusing the cookie, or a `.env` value it rejects. Both are named in the service logs.

**A green stratum check does not mean miners are mining.** It means the port is open. Miners failing to get work may indicate an unsynced node, an unavailable RPC, or, for Bitcoin, disabled ZMQ.

## Backups and Restore

The `main` volume is copied wholesale — `sdk.Backups.ofVolumes('main')`. No dump step and nothing excluded.

- **Included:** the pool database with every miner, share, and block record, plus `.env` and `store.json`.
- **Not included:** nothing of consequence is missing. There are no keys here — payouts go to the Bitcoin address each miner supplies as its username, which lives in the miner's own configuration.
- **Restore:** complete, and no task is raised on this side. Bitcoin's addresses are re-resolved on the first start, so a bitcoind on a different port is picked up automatically. Check the display addresses if the restored server publishes different ones — they are seeded only when missing, so an existing value survives.

## Limitations and Differences

1. **The developer fee is pinned off.** The key is named in the model specifically so a value planted on the volume cannot survive.
2. **One selected node is required.** Bitcoin needs ZMQ; rbitcoin needs JSON-RPC and credentials.
3. **The pool refuses to start when the selected node’s bridge address is unavailable.** A resolved address does not prove RPC is working.
4. **Mainnet only.**
5. **The UI's displayed Stratum address is patched into the built bundle at start** — it is display text, not a binding.
6. **The pool's `.env` is mounted read-only** and is not editable from inside the container.
7. **No riscv64 build.** x86_64 and aarch64 only.
8. The pinned Public Pool detects new blocks by increased height. A same-height chain reorganization does not trigger a new-block event, including in polling mode.

---

## Quick Reference for AI Consumers

```yaml
package_id: public-pool
image: ./Dockerfile
architectures:
  - x86_64
  - aarch64
subcontainers:
  - stratum # the pool server; the one to attach to
  - ui # nginx serving the built web app
volumes:
  main: its mainnet/ at /public-pool/DB, its .env at /public-pool/.env (read-only file)
file_models:
  - .env
  - store.json
startos_managed_env_vars: [] # the pool is configured by .env, not container env
dependencies:
  - bitcoind # optional, active when selected; ZMQ required
  - rbitcoin # optional, active when selected; RPC required
interfaces:
  ui: { type: ui, port: 80 }
  stratum: { type: api, port: 3333 } # plus StartOS-terminated TLS on a second port
actions:
  - config
tasks:
  - { action: autoconfig, severity: critical } # on bitcoind; re-raises
health_checks:
  - stratum # displayed "Stratum Server"
  - ui # displayed "Web Interface"
```
