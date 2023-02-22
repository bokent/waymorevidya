import {
  bufferToArray,
  execute,
  getVoucherPDA,
  getBubblegumAuthorityPDA,
  getMasterEdition,
  getMetadata
} from './helpers'
import {
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
  createCreateMetadataAccountV3Instruction,
  createCreateMasterEditionV3Instruction,
  createSetCollectionSizeInstruction
} from '@metaplex-foundation/mpl-token-metadata'
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Signer,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  LAMPORTS_PER_SOL,
  AccountMeta,
  Connection
} from '@solana/web3.js'
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import { AnchorProvider, BN } from '@project-serum/anchor'
import {
  TokenStandard,
  TokenProgramVersion,
  createCreateTreeInstruction,
  PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
  createTransferInstruction,
  createDecompressV1Instruction,
  createRedeemInstruction,
  MetadataArgs,
  Creator,
  createMintToCollectionV1Instruction
} from '@metaplex-foundation/mpl-bubblegum'
import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  getConcurrentMerkleTreeAccountSize,
  SPL_NOOP_PROGRAM_ID,
  ConcurrentMerkleTreeAccount
} from '@solana/spl-account-compression'
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet'
import axios from 'axios'
import { getEnvVariable } from './config'

/**
 * you can run this mint process with this command
 * $ pnpm ts-node -r dotenv/config src/compressed-token.ts
 *
 * see wholeFlow function to see what is going on when you execute the script
 */

export class WrappedConnection extends Connection {
  axiosInstance: any
  provider: AnchorProvider
  payer: Keypair
  constructor(payer: Keypair, connectionString: string, rpcUrl?: string) {
    super(connectionString, 'confirmed')
    this.axiosInstance = axios.create({
      baseURL: rpcUrl ?? connectionString
    })
    this.provider = new AnchorProvider(new Connection(connectionString), new NodeWallet(payer), {
      commitment: super.commitment,
      skipPreflight: true
    })
    this.payer = payer
  }

  async getAsset(assetId: any): Promise<any> {
    const response = await this.axiosInstance.post('get_asset', {
      jsonrpc: '2.0',
      method: 'getAsset',
      id: 'rpd-op-123',
      params: {
        id: assetId
      }
    })
    console.debug('getAsset response:', response.data.result)
    return response.data.result
  }

  async getAssetProof(assetId: any): Promise<any> {
    const response = await this.axiosInstance.post('get_asset_proof', {
      jsonrpc: '2.0',
      method: 'getAssetProof',
      id: 'rpd-op-123',
      params: {
        id: assetId
      }
    })
    console.debug('getAssetProof response:', response.data.result)
    return response.data.result
  }

  async getAssetsByOwner(
    assetId: string,
    sortBy: any,
    limit: number,
    page: number,
    before: string,
    after: string
  ): Promise<any> {
    const response = await this.axiosInstance.post('get_assets_by_owner', {
      jsonrpc: '2.0',
      method: 'get_assets_by_owner',
      id: 'rpd-op-123',
      params: [assetId, sortBy, limit, page, before, after]
    })
    console.debug('getAssetByOwner response:', response.data.result)
    return response.data.result
  }
}

Error.stackTraceLimit = Infinity
const makeCompressedNFT = (name: string, symbol: string, creators: Creator[] = []) => {
  return {
    name,
    symbol,
    uri: 'https://arweave.net/gfO_TkYttQls70pTmhrdMDz9pfMUXX8hZkaoIivQjGs',
    creators,
    editionNonce: 253,
    tokenProgramVersion: TokenProgramVersion.Original,
    tokenStandard: TokenStandard.NonFungible, // FIXME change to FungibleAsset
    uses: null,
    collection: null,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 0,
    isMutable: false
  }
}

const sleep = async (ms: any) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const mapProof = (assetProof: { proof: string[] }): AccountMeta[] => {
  if (!assetProof.proof || assetProof.proof.length === 0) {
    throw new Error('Proof is empty')
  }
  return assetProof.proof.map((node) => ({
    pubkey: new PublicKey(node),
    isSigner: false,
    isWritable: false
  }))
}

/*


CREATE A NEW TREE and Mint one compressed NFT


*/

const setupTreeWithCompressedNFT = async (
  connectionWrapper: WrappedConnection,
  payerKeypair: Keypair,
  compressedNFT: MetadataArgs,
  maxDepth = 14,
  maxBufferSize = 64
) => {
  const payer = payerKeypair.publicKey
  const merkleTreeKeypair = Keypair.generate()
  const merkleTree = merkleTreeKeypair.publicKey
  const space = getConcurrentMerkleTreeAccountSize(maxDepth, maxBufferSize, 5)
  const collectionMint = await Token.createMint(
    connectionWrapper,
    payerKeypair,
    payer,
    payer,
    0,
    TOKEN_PROGRAM_ID
  )
  const collectionTokenAccount = await collectionMint.createAccount(payer)
  await collectionMint.mintTo(collectionTokenAccount, payerKeypair, [], 1)
  const [colectionMetadataAccount, _b] = await PublicKey.findProgramAddress(
    [
      Buffer.from('metadata', 'utf8'),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      collectionMint.publicKey.toBuffer()
    ],
    TOKEN_METADATA_PROGRAM_ID
  )
  const collectionMeatadataIX = createCreateMetadataAccountV3Instruction(
    {
      metadata: colectionMetadataAccount,
      mint: collectionMint.publicKey,
      mintAuthority: payer,
      payer,
      updateAuthority: payer
    },
    {
      createMetadataAccountArgsV3: {
        data: {
          name: 'oh',
          symbol: 'oh',
          uri: 'oh',
          sellerFeeBasisPoints: 100,
          creators: null,
          collection: null,
          uses: null
        },
        isMutable: false,
        collectionDetails: null
      }
    }
  )
  const [collectionMasterEditionAccount, _b2] = await PublicKey.findProgramAddress(
    [
      Buffer.from('metadata', 'utf8'),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      collectionMint.publicKey.toBuffer(),
      Buffer.from('edition', 'utf8')
    ],
    TOKEN_METADATA_PROGRAM_ID
  )
  const collectionMasterEditionIX = createCreateMasterEditionV3Instruction(
    {
      edition: collectionMasterEditionAccount,
      mint: collectionMint.publicKey,
      updateAuthority: payer,
      mintAuthority: payer,
      payer: payer,
      metadata: colectionMetadataAccount
    },
    {
      createMasterEditionArgs: {
        maxSupply: 0
      }
    }
  )

  const sizeCollectionIX = createSetCollectionSizeInstruction(
    {
      collectionMetadata: colectionMetadataAccount,
      collectionAuthority: payer,
      collectionMint: collectionMint.publicKey
    },
    {
      setCollectionSizeArgs: { size: 0 }
    }
  )

  const txCollection = new Transaction()
    .add(collectionMeatadataIX)
    .add(collectionMasterEditionIX)
    .add(sizeCollectionIX)
  txCollection.feePayer = payer
  await sendAndConfirmTransaction(connectionWrapper, txCollection, [payerKeypair], {
    commitment: 'confirmed',
    skipPreflight: true
  })

  const allocTreeIx = SystemProgram.createAccount({
    fromPubkey: payer,
    newAccountPubkey: merkleTree,
    lamports: await connectionWrapper.getMinimumBalanceForRentExemption(space),
    space: space,
    programId: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID
  })
  const [treeAuthority, _bump] = await PublicKey.findProgramAddress(
    [merkleTree.toBuffer()],
    BUBBLEGUM_PROGRAM_ID
  )
  const createTreeIx = createCreateTreeInstruction(
    {
      merkleTree,
      treeAuthority,
      treeCreator: payer,
      payer,
      logWrapper: SPL_NOOP_PROGRAM_ID,
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID
    },
    {
      maxBufferSize,
      maxDepth,
      public: false
    },
    BUBBLEGUM_PROGRAM_ID
  )
  const [bgumSigner, __] = await PublicKey.findProgramAddress(
    [Buffer.from('collection_cpi', 'utf8')],
    BUBBLEGUM_PROGRAM_ID
  )
  const mintIx = createMintToCollectionV1Instruction(
    {
      merkleTree,
      treeAuthority,
      treeDelegate: payer,
      payer,
      leafDelegate: payer,
      leafOwner: payer,
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      logWrapper: SPL_NOOP_PROGRAM_ID,
      collectionAuthority: payer,
      collectionAuthorityRecordPda: BUBBLEGUM_PROGRAM_ID,
      collectionMint: collectionMint.publicKey,
      collectionMetadata: colectionMetadataAccount,
      editionAccount: collectionMasterEditionAccount,
      bubblegumSigner: bgumSigner,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID
    },
    {
      metadataArgs: Object.assign(compressedNFT, {
        collection: { key: collectionMint.publicKey, verified: false }
      })
    }
  )
  let tx = new Transaction().add(allocTreeIx).add(createTreeIx)
  tx.feePayer = payer
  await sendAndConfirmTransaction(connectionWrapper, tx, [merkleTreeKeypair, payerKeypair], {
    commitment: 'confirmed',
    skipPreflight: true
  })
  tx = new Transaction().add(mintIx)
  tx.feePayer = payer
  await sendAndConfirmTransaction(connectionWrapper, tx, [payerKeypair], {
    commitment: 'confirmed',
    skipPreflight: true
  })
  return {
    merkleTree
  }
}

const transferAsset = async (
  connectionWrapper: WrappedConnection,
  newOwner: Keypair,
  canopyHeight: number | undefined,
  assetId: string
) => {
  console.log('transfer')
  const assetProof = await connectionWrapper.getAssetProof(assetId)
  const proofPath = mapProof(assetProof)
  const rpcAsset = await connectionWrapper.getAsset(assetId)

  const leafNonce = rpcAsset.compression.leaf_id
  const treeAuthority = await getBubblegumAuthorityPDA(new PublicKey(assetProof.tree_id))
  const leafDelegate = rpcAsset.ownership.delegate
    ? new PublicKey(rpcAsset.ownership.delegate)
    : new PublicKey(rpcAsset.ownership.owner)
  const transferIx = createTransferInstruction(
    {
      treeAuthority,
      leafOwner: new PublicKey(rpcAsset.ownership.owner),
      leafDelegate: leafDelegate,
      newLeafOwner: newOwner.publicKey,
      merkleTree: new PublicKey(assetProof.tree_id),
      logWrapper: SPL_NOOP_PROGRAM_ID,
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      anchorRemainingAccounts: proofPath.slice(0, proofPath.length - (canopyHeight ?? 0))
    },
    {
      root: bufferToArray(bs58.decode(assetProof.root)),
      dataHash: bufferToArray(bs58.decode(rpcAsset.compression.data_hash.trim())),
      creatorHash: bufferToArray(bs58.decode(rpcAsset.compression.creator_hash.trim())),
      nonce: leafNonce,
      index: leafNonce
    }
  )
  await execute(connectionWrapper.provider, [transferIx], [connectionWrapper.payer], true)
}

const redeemAsset = async (
  connectionWrapper: WrappedConnection,
  canopyHeight: number | undefined,
  payer?: Keypair,
  assetId?: string
) => {
  console.log('redeem')
  const assetProof = await connectionWrapper.getAssetProof(assetId)
  const rpcAsset = await connectionWrapper.getAsset(assetId)
  const voucher = await getVoucherPDA(new PublicKey(assetProof.tree_id), 0)
  const leafNonce = rpcAsset.compression.leaf_id
  const treeAuthority = await getBubblegumAuthorityPDA(new PublicKey(assetProof.tree_id))
  const leafDelegate = rpcAsset.ownership.delegate
    ? new PublicKey(rpcAsset.ownership.delegate)
    : new PublicKey(rpcAsset.ownership.owner)
  const redeemIx = createRedeemInstruction(
    {
      treeAuthority,
      leafOwner: new PublicKey(rpcAsset.ownership.owner),
      leafDelegate,
      merkleTree: new PublicKey(assetProof.tree_id),
      voucher,
      logWrapper: SPL_NOOP_PROGRAM_ID,
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID
    },
    {
      root: bufferToArray(bs58.decode(assetProof.root)),
      dataHash: bufferToArray(bs58.decode(rpcAsset.compression.data_hash.trim())),
      creatorHash: bufferToArray(bs58.decode(rpcAsset.compression.creator_hash.trim())),
      nonce: leafNonce,
      index: leafNonce
    }
  )
  const _payer = payer ?? connectionWrapper.provider.wallet
  await execute(connectionWrapper.provider, [redeemIx], [_payer as Signer], true)
}

async function decompressAsset(
  connectionWrapper: WrappedConnection,
  canopyHeight: number | undefined,
  payer?: Keypair,
  assetId?: string
) {
  console.log('decompress ', assetId)
  const assetProof = await connectionWrapper.getAssetProof(assetId)
  const proofPath = mapProof(assetProof)
  const rpcAsset = await connectionWrapper.getAsset(assetId)
  const voucher = await getVoucherPDA(new PublicKey(assetProof.tree_id), 0)
  const leafNonce = rpcAsset.compression.leaf_id

  await redeemAsset(connectionWrapper, canopyHeight, payer, assetId)

  const [assetPDA] = await PublicKey.findProgramAddress(
    [
      Buffer.from('asset'),
      new PublicKey(assetProof.tree_id).toBuffer(),
      leafNonce.toBuffer('le', 8)
    ],
    BUBBLEGUM_PROGRAM_ID
  )
  const [mintAuthority] = await PublicKey.findProgramAddress(
    [assetPDA.toBuffer()],
    BUBBLEGUM_PROGRAM_ID
  )

  sleep(20000)
  const assetAgain = await connectionWrapper.getAsset(rpcAsset.id)

  const metadata: MetadataArgs = {
    name: rpcAsset.content.metadata.name,
    symbol: rpcAsset.content.metadata.symbol,
    uri: rpcAsset.content.json_uri,
    sellerFeeBasisPoints: rpcAsset.royalty.basis_points,
    primarySaleHappened: rpcAsset.royalty.primary_sale_happened,
    isMutable: rpcAsset.mutable,
    editionNonce: rpcAsset.supply.edition_nonce,
    tokenStandard: TokenStandard.NonFungible, // FIXME change to FungibleAsset
    collection: rpcAsset.grouping,
    uses: rpcAsset.uses,
    tokenProgramVersion: TokenProgramVersion.Original,
    creators: rpcAsset.creators
  }

  const decompressIx = createDecompressV1Instruction(
    {
      voucher: voucher,
      leafOwner: new PublicKey(assetAgain.ownership.owner),
      tokenAccount: await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        new PublicKey(assetAgain.id),
        new PublicKey(assetAgain.ownership.owner)
      ),
      mint: new PublicKey(assetAgain.id),
      mintAuthority: mintAuthority,
      metadata: await getMetadata(new PublicKey(assetAgain.id)),
      masterEdition: await getMasterEdition(new PublicKey(assetAgain.id)),
      sysvarRent: SYSVAR_RENT_PUBKEY,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      logWrapper: SPL_NOOP_PROGRAM_ID,
      anchorRemainingAccounts: proofPath.slice(0, proofPath.length - (canopyHeight ?? 0))
    },
    {
      // this can be grabbed onChain by using the metadataArgsBeet.deserialize
      // currently there is an error inside beet program while using it
      metadata
    }
  )
  const _payer = payer ?? connectionWrapper.provider.wallet
  await execute(connectionWrapper.provider, [decompressIx], [_payer as Signer], true)
}

const wholeFlow = async (opts: { decopres?: boolean } = {}) => {
  const rpcUrl = 'https://rpc-devnet.aws.metaplex.com/'
  const connectionString = 'https://liquid.devnet.rpcpool.com/5ebea512d12be102f53d319dafc8'

  // Generic secret key is used as a simple solution
  // we should use creators sign to proceed with creation of token accounts
  const demoSecretKey = getEnvVariable('DEMO_SECRET_KEY')
  const creatorKeypair = Keypair.fromSecretKey(Buffer.from(JSON.parse(demoSecretKey)))

  // const royaltySecretKey = getEnvVariable('PROJECT_ROYALTY_SECRET_KEY')
  // const projectRoyaltyKeypair = Keypair.fromSecretKey(Buffer.from(JSON.parse(royaltySecretKey)))

  // set up connection object
  // provides all connection functions and rpc functions
  const connectionWrapper = new WrappedConnection(creatorKeypair, connectionString, rpcUrl)

  // await connectionWrapper.requestAirdrop(
  //   connectionWrapper.payer.publicKey,
  //   LAMPORTS_PER_SOL
  // );
  console.log('payer', connectionWrapper.provider.wallet.publicKey.toBase58())
  // returns filled out metadata args struct, doesn't actually do anything mint wise
  const originalCompressedNFT = makeCompressedNFT('degen test', 'TST DAPE', [
    {
      address: creatorKeypair.publicKey,
      share: 100,
      verified: true
    }
  ])
  // creates  and executes the merkle tree ix
  // and the mint ix is executed here as well
  const result = await setupTreeWithCompressedNFT(
    connectionWrapper,
    connectionWrapper.payer,
    originalCompressedNFT,
    14,
    64
  )
  const merkleTree = result.merkleTree
  const mkAccount = await ConcurrentMerkleTreeAccount.fromAccountAddress(
    connectionWrapper,
    merkleTree
  )
  const canopyHeight = mkAccount.getCanopyDepth()
  const leafIndex = new BN.BN(0)
  // grabbing the asset id so that it can be passed to transfer
  const [assetId] = await PublicKey.findProgramAddress(
    [
      Buffer.from('asset', 'utf8'),
      merkleTree.toBuffer(),
      Uint8Array.from(leafIndex.toArray('le', 8))
    ],
    BUBBLEGUM_PROGRAM_ID
  )

  console.log('wait 15 sec')
  await sleep(15000)

  const assetString = assetId.toBase58()
  const newOwner = Keypair.generate()
  console.log('new owner', newOwner.publicKey.toBase58())

  console.log('wait 2 min')
  sleep(120000)

  console.log('asset PDA:', assetString)
  await execute(
    connectionWrapper.provider,
    [
      SystemProgram.transfer({
        fromPubkey: connectionWrapper.provider.publicKey,
        toPubkey: newOwner.publicKey,
        lamports: LAMPORTS_PER_SOL
      })
    ],
    [connectionWrapper.payer],
    true
  )

  // transferring the compressed asset to a new owner
  await transferAsset(connectionWrapper, newOwner, canopyHeight, assetString)

  if (opts.decopres) {
    console.log('wait 15 sec')
    sleep(15_000)
    // asset has to be redeemed before it can be decompressed
    // redeem is included above as a separate function because it can be called
    // without decompressing nftbut it is also called
    // inside of decompress so we don't need to call that separately here
    await decompressAsset(connectionWrapper, canopyHeight, newOwner, assetString)
  }
}

wholeFlow()
