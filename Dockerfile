FROM node:18.20.4-bookworm-slim AS build

# Public Pool repo does not use versions/tags yet, point directly to commit sha
ARG PUBLIC_POOL_SHA=0917911eb0edeba35e1cbe8de0c01d8a4e502cfb
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

COPY patches/rpc-bitcoin+2.0.0.patch /build/public-pool/patches/rpc-bitcoin+2.0.0.patch

RUN \
    cd public-pool && \
    npm i && npm i patch-package && \
    # apply patch for rpc-bitcoin (see: https://github.com/vansergen/rpc-bitcoin/pull/65)
    npx patch-package && \
    npm run build

RUN \
    git clone https://github.com/benjamin-wilson/public-pool-ui.git && \
    cd public-pool-ui && \
    git checkout ${PUBLIC_POOL_UI_SHA}

# patch environment.prod.ts for self-hosting
COPY patches/environment.prod.ts /build/public-pool-ui/src/environments/environment.prod.ts

RUN \
    cd public-pool-ui && \
    npm i && npm run build

FROM node:18.20.4-bookworm-slim

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
COPY --from=build /build/public-pool .

WORKDIR /var/www/html
COPY --from=build /build/public-pool-ui/dist/public-pool-ui .

COPY docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
