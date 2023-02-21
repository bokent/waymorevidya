import web3 from '@solana/web3.js'
import { getRpcUrl } from './config'

export function getConnection() {
  return new web3.Connection(getRpcUrl())
}
