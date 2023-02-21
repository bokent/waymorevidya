export function getEnvVariable(name: string): string {
  const value = process.env[name]
  if (typeof value === 'undefined') {
    throw new Error(`${name} environment variable is not defined`)
  }
  return value
}

const SUPPORTED_NETWORKS = Object.freeze(['mainnet-beta', 'devent'])
type Network = typeof SUPPORTED_NETWORKS[number]

export function getNetwork(): Network {
  const network = getEnvVariable('NETWORK')
  if (SUPPORTED_NETWORKS.includes(network)) {
    return network
  }
  throw new Error(`NETOWRK environment variable has unsupported value ${network}`)
}

export function isMainnet(): boolean {
  return getNetwork() === 'mainnet-beta'
}

export function isDevnet(): boolean {
  return getNetwork() === 'devnet'
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
