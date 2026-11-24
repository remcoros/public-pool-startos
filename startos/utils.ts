import { T } from '@start9labs/start-sdk'
import {
  rpcCookieName,
  rpcHostId as btcRpcHostId,
  rpcPort as btcRpcPort,
  zmqHostId as btcZmqHostId,
  zmqPortBlock as btcZmqPortBlock,
} from 'bitcoin-core-startos/startos/utils'
import {
  rpcHostId as testRpcHostId,
  rpcPort as testRpcPort,
  zmqHostId as testZmqHostId,
  zmqPortBlock as testZmqPortBlock,
} from 'bitcoin-core-testnet-startos/startos/utils'
import { sdk } from './sdk'

export const uiPort = 80
export const stratumPort = 3333
export const bitcoindMountpoint = '/mnt/bitcoind'
export const bitcoindCookie = `${bitcoindMountpoint}/${rpcCookieName}`

/**
 * bitcoind's RPC and ZMQ-block endpoints over the LXC bridge, which main writes
 * into `.env` before the stratum daemon starts. One reactive subscription per
 * host (RPC and ZMQ are separate bitcoind hosts); each fires only when its own
 * assigned port changes, so bitcoind updates and restarts never restart the
 * pool. undefined until bitcoind's bindings resolve.
 */
export const getBitcoindBridge = async (effects: T.Effects) => {
  const rpc = await sdk.host
    .getBridgeAddress(effects, {
      packageId: 'bitcoind',
      hostId: btcRpcHostId,
      internalPort: btcRpcPort,
      ssl: false,
    })
    .const()
  const zmq = await sdk.host
    .getBridgeAddress(effects, {
      packageId: 'bitcoind',
      hostId: btcZmqHostId,
      internalPort: btcZmqPortBlock,
    })
    .const()
  if (!rpc || !zmq) return undefined
  const [rpcHost, rpcPort] = rpc.split(':')
  const [zmqHost, zmqPort] = zmq.split(':')
  return { rpcHost, rpcPort, zmqHost, zmqPort }
}

export const getTestnetBridge = async (effects: T.Effects) => {
  const rpc = await sdk.host
    .getBridgeAddress(effects, {
      packageId: 'bitcoind-testnet',
      hostId: testRpcHostId,
      internalPort: testRpcPort,
      ssl: false,
    })
    .const()
  const zmq = await sdk.host
    .getBridgeAddress(effects, {
      packageId: 'bitcoind-testnet',
      hostId: testZmqHostId,
      internalPort: testZmqPortBlock,
    })
    .const()
  if (!rpc || !zmq) return undefined
  const [rpcHost, rpcPort] = rpc.split(':')
  const [zmqHost, zmqPort] = zmq.split(':')
  return { rpcHost, rpcPort, zmqHost, zmqPort }
}
