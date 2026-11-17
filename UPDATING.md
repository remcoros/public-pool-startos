# Updating the upstream version

Public Pool has no upstream tags or releases on either repo — both the backend ([benjamin-wilson/public-pool](https://github.com/benjamin-wilson/public-pool)) and the UI ([benjamin-wilson/public-pool-ui](https://github.com/benjamin-wilson/public-pool-ui)) are tracked by commit SHA on `master`. The manifest's image is built from source (`dockerBuild`), so there is no `dockerTag` to bump.

## ⚠️ The UI is temporarily pinned

`ARG PUBLIC_POOL_UI_SHA` is **deliberately held at `1c0b2d93e3ce0a81d4faa7b1d444ace936e3f63d`** (a pre-overhaul commit). Upstream is rebuilding the frontend, and newer UI commits are incompatible with the current backend — see [issue #20](https://github.com/Start9Labs/public-pool-startos/issues/20). **Do not bump the UI past this commit** until upstream confirms the overhaul is complete and backend-compatible.

This pin also reverted the package's UI-config wiring to what this older UI generation needs:

- The UI reads config from a **build-time** `src/environments/environment.prod.ts` (it has **no** `runtime-config.js` / `window.__PUBLIC_POOL_CONFIG__` hook).
- `Dockerfile` copies `assets/patches/environment.prod.ts` over the UI's `environment.prod.ts` before building: relative `API_URL` + a literal `<Stratum URL>` placeholder.
- `startos/main.ts` replaces that placeholder in `main.*.js` using Node with the configured display address at container start.
- Only the **plain** stratum display URL is rendered. TLS on port 4333 still works for miners, but the **Secure Server Display URL** config option (`securePoolDisplayUrl` / `store.secureStratumDisplayAddress`) is dormant — this UI has no `SECURE_STRATUM_URL` field.

### When upstream is ready — unpinning recipe

When the overhaul lands and a compatible UI exists, bring the newer mechanism back. The full pre-pin implementation lives at commit `ca920db` (PR #19) — `git show ca920db:<file>` is the cleanest reference. In short:

1. **`Dockerfile`** — set `ARG PUBLIC_POOL_UI_SHA` to the new commit, and **remove** the `COPY assets/patches/environment.prod.ts …` line so the UI builds from pristine upstream source (only the `angular.json` build fix in `public-pool-ui.patch` remains; refresh it if upstream changed `angular.json`).
2. **`startos/main.ts`** — replace the bundle-substitution block with the runtime-config injection: overwrite `/var/www/html/assets/runtime-config.js` with `window.__PUBLIC_POOL_CONFIG__ = { API_URL, STRATUM_URL, SECURE_STRATUM_URL }` (reading both `stratumDisplayAddress` and `secureStratumDisplayAddress` from `store`), and `rm -f` the precompressed `.gz`/`.br` siblings so nginx can't serve the stale placeholder.
3. **`assets/nginx.conf`** — re-add the `location = /assets/runtime-config.js` block with `gzip_static off` + `Cache-Control: no-store`.
4. **`assets/patches/environment.prod.ts`** — delete it (no longer copied in).
5. **Docs** — drop the "secure URL not shown" / "UI pinned" caveats from `README.md` and `instructions.md`.

## Determining the upstream version

- **Backend** — [benjamin-wilson/public-pool](https://github.com/benjamin-wilson/public-pool). Latest `master` commit:

  ```sh
  gh api repos/benjamin-wilson/public-pool/commits/master --jq '.sha'
  ```

  Pin lives in `Dockerfile` as `ARG PUBLIC_POOL_SHA`.

- **UI** — [benjamin-wilson/public-pool-ui](https://github.com/benjamin-wilson/public-pool-ui). Latest `master` commit:
  ```sh
  gh api repos/benjamin-wilson/public-pool-ui/commits/master --jq '.sha'
  ```
  Pin lives in `Dockerfile` as `ARG PUBLIC_POOL_UI_SHA` — **currently frozen, see above.**

## Applying the bump

- **Backend** — update `ARG PUBLIC_POOL_SHA=<new sha>` at the top of `Dockerfile`.
- **UI** — **frozen for now** (see "The UI is temporarily pinned" above). Once unfrozen, follow the unpinning recipe, then keep `ARG PUBLIC_POOL_UI_SHA` current with `master` and refresh `public-pool-ui.patch` if upstream's `angular.json` changed.
