import { clusterApiUrl, Cluster } from '@solana/web3.js'

export function getEnvVariable(name: string): string {
  const value = process.env[name]
  if (typeof value === 'undefined') {
    throw new Error(`${name} environment variable is not defined`)
  }
  return value
}

const SUPPORTED_NETWORKS: Readonly<Cluster[]> = Object.freeze(['mainnet-beta', 'devnet'])
type SupportedNetwork = typeof SUPPORTED_NETWORKS[number]

export function getNetwork(): SupportedNetwork {
  const network = getEnvVariable('NETWORK')
  if (SUPPORTED_NETWORKS.includes(network as SupportedNetwork)) {
    return network as SupportedNetwork
  }
  throw new Error(`NETOWRK environment variable has unsupported value ${network}`)
}

export function isMainnet(): boolean {
  return getNetwork() === 'mainnet-beta'
}

export function isDevnet(): boolean {
  return getNetwork() === 'devnet'
}

export function getRpcUrl(): string {
  try {
    return getEnvVariable('RPC_URL')
  } catch (_err) {
    return clusterApiUrl(getNetwork())
  }
}

export function getStorageConfig() {
  if (isMainnet()) {
    return {}
  }

  return {
    address: 'https://devnet.bundlr.network',
    providerUrl: 'https://api.devnet.solana.com',
    timeout: 30000
  }
}
