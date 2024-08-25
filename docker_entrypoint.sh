#!/bin/bash

set -ea

echo
echo "Starting Public Pool..."
echo

#cp -f /etc/Caddyfile.tpl /etc/Caddyfile
#sed -i "s#%%LOGLEVEL%%#${LOGLEVEL:-INFO}#g" /etc/Caddyfile
#sed -i "s#%%LOGFORMAT%%#${LOGFORMAT:-json}#g" /etc/Caddyfile

# TODO: switch between mainnet/testnet
export BITCOIN_RPC_USER=$(yq e '.bitcoind.user' /public-pool-data/start9/config.yaml)
export BITCOIN_RPC_PASSWORD=$(yq e '.bitcoind.password' /public-pool-data/start9/config.yaml)
export BITCOIN_RPC_TIMEOUT=10000
export API_PORT=3334
export STRATUM_PORT=3333
export DEV_FEE_ADDRESS=
export API_SECURE=false

case "$(yq e '.bitcoind.type' /public-pool-data/start9/config.yaml)" in
"mainnet")
    mkdir -p /public-pool-data/mainnet
    ln -s /public-pool-data/mainnet /public-pool/DB
    export NETWORK=mainnet
    export BITCOIN_ZMQ_HOST=tcp://bitcoind.embassy:28333
    export BITCOIN_RPC_URL=http://bitcoind.embassy
    export BITCOIN_RPC_PORT=8332
    echo "Configured Public Pool for mainnet: $BITCOIN_RPC_URL:$BITCOIN_RPC_PORT"
    ;;
"testnet")
    mkdir -p /public-pool-data/testnet
    ln -s /public-pool-data/testnet /public-pool/DB
    export NETWORK=testnet
    # ZMQ seems to not work correctly (yet) on testnet4 + public pool
    #export BITCOIN_ZMQ_HOST=tcp://bitcoind-testnet.embassy:28333
    export BITCOIN_RPC_URL=http://bitcoind-testnet.embassy
    export BITCOIN_RPC_PORT=48332
    echo "Configured Public Pool for testnet4: $BITCOIN_RPC_URL:$BITCOIN_RPC_PORT"
    ;;
*)
    echo "Unknown Bitcoin Core node type. Exiting."
    exit
    ;;
esac

cd /public-pool
/usr/local/bin/node dist/main &
app_process=$!

#caddy run --config /etc/Caddyfile &
#proxy_process=$!

nginx -g "daemon off;" &
proxy_process=$!

# hook the TERM signal and wait for all our processes
_term() {
    echo "Caught TERM signal!"
    kill -TERM "$proxy_process" 2>/dev/null
    kill -TERM "$app_process" 2>/dev/null
}

trap _term TERM
wait $app_process $proxy_process
