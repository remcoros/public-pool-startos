FROM node:20-bookworm-slim AS build

# Public Pool repo does not use versions/tags yet, point directly to commit sha
ARG PUBLIC_POOL_SHA=4282233d2f11ceecbd0d142e8292ccc9c37ea999
ARG PUBLIC_POOL_UI_SHA=80081e337d3af829b0edf3990ad97ea430bd73d4

# these are specified in Makefile
ARG PLATFORM
ARG YQ_VERSION
ARG YQ_SHA

RUN \
    apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    build-essential ca-certificates cmake curl git python3 wget && \
    apt clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN \
    # install yq
    wget -qO /tmp/yq https://github.com/mikefarah/yq/releases/download/v${YQ_VERSION}/yq_linux_${PLATFORM} && \
    echo "${YQ_SHA} /tmp/yq" | sha256sum -c || exit 1 && \ 
    mv /tmp/yq /usr/local/bin/yq && chmod +x /usr/local/bin/yq

WORKDIR /build

RUN \
    git clone https://github.com/benjamin-wilson/public-pool.git && \
    cd public-pool && \
    git checkout ${PUBLIC_POOL_SHA}

# apply patch for rpc-bitcoin (see: https://github.com/vansergen/rpc-bitcoin/pull/65)
COPY patches/rpc-bitcoin+2.0.0.patch /build/public-pool/patches/rpc-bitcoin+2.0.0.patch

RUN \
    cd public-pool && \
    npm ci && \
    # apply patch for rpc-bitcoin (see: https://github.com/vansergen/rpc-bitcoin/pull/65)
    npm i patch-package && \
    npx patch-package && \
    npm run build

RUN \
    git clone https://github.com/benjamin-wilson/public-pool-ui.git && \
    cd public-pool-ui && \
    git checkout ${PUBLIC_POOL_UI_SHA}

# patch environment.prod.ts for self-hosting
COPY patches/environment.prod.ts /build/public-pool-ui/src/environments/environment.prod.ts
COPY patches/public-pool-ui.patch /build/public-pool-ui/public-pool-ui.patch

RUN \
    cd public-pool-ui && \
    git apply public-pool-ui.patch && \
    npm ci && \
    npm run build

# main container
FROM node:20-bookworm-slim

ENV NODE_ENV=production

RUN \
    apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    nginx && \
    apt clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY --from=build /usr/local/bin/yq /usr/local/bin/yq
COPY assets/nginx.conf /etc/nginx/sites-available/default

WORKDIR /public-pool
COPY --from=build /build/public-pool/node_modules ./node_modules
COPY --from=build /build/public-pool/dist ./dist

WORKDIR /var/www/html
COPY --from=build /build/public-pool-ui/dist/public-pool-ui .

COPY docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
