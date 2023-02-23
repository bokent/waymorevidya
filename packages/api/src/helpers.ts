import { PROGRAM_ID, TreeConfig } from '@metaplex-foundation/mpl-bubblegum'
import { Connection, PublicKey, Signer, Transaction, TransactionInstruction } from '@solana/web3.js'
import { AnchorProvider, BN } from '@project-serum/anchor'
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata'

export async function getBubblegumAuthorityPDA(merkleRollPubKey: PublicKey) {
  const [bubblegumAuthorityPDAKey] = await PublicKey.findProgramAddress(
    [merkleRollPubKey.toBuffer()],
    PROGRAM_ID
  )
  return bubblegumAuthorityPDAKey
}

export async function getNonceCount(connection: Connection, tree: PublicKey): Promise<BN> {
  const treeAuthority = await getBubblegumAuthorityPDA(tree)
  return new BN((await TreeConfig.fromAccountAddress(connection, treeAuthority)).numMinted)
}

export function bufferToArray(buffer: Buffer): number[] {
  const nums = []
  for (let i = 0; i < buffer.length; i++) {
    nums.push(buffer[i])
  }
  return nums
}

export async function execute(
  provider: AnchorProvider,
  instructions: TransactionInstruction[],
  signers: Signer[],
  skipPreflight = false,
  verbose = false
): Promise<string> {
  const tx = new Transaction()
  for (const ix of instructions) {
    tx.add(ix)
  }

  let txid: string | null = null
  try {
    txid = await provider.sendAndConfirm(tx, signers, {
      skipPreflight
    })
  } catch (e: any) {
    console.log('tx execution error', e)
    if (e.response.data) {
      console.log('tx execution response', e.response.data)
    }
    if (e.logs) {
      console.log('tx logs', e.logs)
    }
    throw e
  }

  if (verbose && txid) {
    console.log(
      (await provider.connection.getConfirmedTransaction(txid, 'confirmed'))!.meta!.logMessages
    )
  }

  return txid
}

export async function getVoucherPDA(tree: PublicKey, leafIndex: number): Promise<PublicKey> {
  const [voucher] = await PublicKey.findProgramAddress(
    [
      Buffer.from('voucher', 'utf8'),
      tree.toBuffer(),
      Uint8Array.from(new BN(leafIndex).toArray('le', 8))
    ],
    PROGRAM_ID
  )
  return voucher
}

export async function getMetadata(mint: PublicKey) {
  return (
    await PublicKey.findProgramAddress(
      [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0]
}

export async function getMasterEdition(mint: PublicKey) {
  return (
    await PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from('edition')
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0]
}
