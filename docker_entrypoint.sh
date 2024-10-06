#!/bin/bash

set -ea

echo
echo "Starting Public Pool..."
echo

export BITCOIN_RPC_USER=$(yq e '.bitcoind.user' /public-pool-data/start9/config.yaml)
export BITCOIN_RPC_PASSWORD=$(yq e '.bitcoind.password' /public-pool-data/start9/config.yaml)
export BITCOIN_RPC_TIMEOUT=$(yq e '.rpc-timeout' /public-pool-data/start9/config.yaml)
export API_PORT=3334
export STRATUM_PORT=3333
export DEV_FEE_ADDRESS=
export API_SECURE=false

ZMQ_ENABLED=$(yq e '.zmq-enabled' /public-pool-data/start9/config.yaml)
case "$(yq e '.bitcoind.type' /public-pool-data/start9/config.yaml)" in
"mainnet")
    mkdir -p /public-pool-data/mainnet
    ln -s /public-pool-data/mainnet /public-pool/DB

    export NETWORK=mainnet
    export BITCOIN_RPC_URL=http://bitcoind.embassy
    export BITCOIN_RPC_PORT=8332

    echo "Configured Public Pool for mainnet: $BITCOIN_RPC_URL:$BITCOIN_RPC_PORT"

    if [ "$ZMQ_ENABLED" = "true" ]; then
        export BITCOIN_ZMQ_HOST=tcp://bitcoind.embassy:28332
        echo "ZMQ Enabled"
    fi
    ;;
"testnet")
    mkdir -p /public-pool-data/testnet
    ln -s /public-pool-data/testnet /public-pool/DB

    export NETWORK=testnet
    export BITCOIN_RPC_URL=http://bitcoind-testnet.embassy
    export BITCOIN_RPC_PORT=48332

    echo "Configured Public Pool for testnet4: $BITCOIN_RPC_URL:$BITCOIN_RPC_PORT"

    if [ "$ZMQ_ENABLED" = "true" ]; then
        export BITCOIN_ZMQ_HOST=tcp://bitcoind-testnet.embassy:28332
        echo "ZMQ Enabled"
    fi
    ;;
*)
    echo "Unknown Bitcoin Core node type. Exiting."
    exit 1
    ;;
esac

export POOL_IDENTIFIER=$(yq e '.pool-identifier' /public-pool-data/start9/config.yaml)
echo "Set POOL_IDENTIFIER to '$POOL_IDENTIFIER'"

# set custom server address (shown on homepage)
POOL_ADDRESS=$(yq e '.pool-address' /public-pool-data/start9/config.yaml)
if [ -n "$POOL_ADDRESS" ] && [ "$POOL_ADDRESS" != "null" ]; then
    sed -i "s/<StartOS Server IP>/$POOL_ADDRESS/" $(find /var/www/html/main.*.js)
fi

cd /public-pool
/usr/local/bin/node dist/main.js &
app_process=$!

nginx -g "daemon off;" &
proxy_process=$!

# hook the TERM signal and wait
_term() {
    echo "Caught TERM signal!"
    kill -TERM "$proxy_process" 2>/dev/null
    kill -TERM "$app_process" 2>/dev/null
}

trap _term TERM

# wait for one of the processes to finish (or crash)
wait -n $app_process $proxy_process
status=$?

# terminate the rest of processes
kill -TERM "$proxy_process" 2>/dev/null
kill -TERM "$app_process" 2>/dev/null

exit $status