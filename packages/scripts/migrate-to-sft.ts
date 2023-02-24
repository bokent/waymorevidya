import { MongoClient, MongoClientOptions } from 'mongodb'
import * as dotenv from 'dotenv'
import { itemModel, lootboxModel, traitModel, sftConfigModel } from 'shared/src/models'
import { Item, Trait, Lootbox } from 'shared/src/types'
import { getItemsByAppId } from 'shared/src/models'
dotenv.config()

const mongoUrl = process.env.MONGO_URL ?? ''
const dbName = process.env.MONGO_DB
const mongo_item_collection = process.env.MONGO_ITEM_COLLECTION ?? ''
const apiKey = process.env.API_KEY
const HARD_CODE_SOL_USD = 24.15

function mapTraits(tags: Item['tags']) {
  const attributes = tags.map((tag) => ({
    trait_type: tag.category,
    value: tag.value
  }))
  return attributes
}

async function main() {
  const items = await getItemsByAppId(570)
  const parsed_items = items.map((item) => {
    // console.log(item)
    const offChainMetadata: any = {
      name: item.marketHashName,
      seller_fee_basis_points: 100,
      image: item.imageUrl,
      attributes: mapTraits(item.tags),
      properties: {
        creators: {
          address: "CmrMC3weTisa5DJN4m5qKNLts7E2byzZMq9vfj4MxazP",
          share: 100
        },
        files: [
          {
            type: 'image/jpg',
            uri: item.imageUrl
          }
        ],
        category: 'image'
      }
    }

    // let secretKey = bs58.decode(
    //   '45rkPasniJHu8zXkZqQ5wWmo735kpzejx72wK798Tup3pT2U3HTZJX7AUhWxejwtaujuizbxQGEFTCj6PXBhHpa7'
    // )
    // console.log(`[${web3.Keypair.fromSecretKey(secretKey).secretKey}]`)
    // const creatorKeypair = Keypair.fromSecretKey(secretKey)

    // const collectionSigner: KeypairSigner = {
    //   publicKey: creatorKeypair.publicKey,
    //   secretKey: creatorKeypair.secretKey
    // }

    // const connection = new Connection(
      // 'https://young-twilight-sun.solana-mainnet.quiknode.pro/1a84a0b63b2865dbdecc5cc27916b8298e8c4083/'
    // )
    // const metaplex = Metaplex.make(connection).use(keypairIdentity(creatorKeypair))

    // const obj = await metaplex.nfts().uploadMetadata(offChainMetadata)
    // console.log(obj)
    // const uri = obj.uri
    const createSftInput = {
      collection: { name: item.marketHashName },
      imgUrl: item.imageUrl,
      sellerFeeBasisPoints: 100,
      attributes: mapTraits(item.tags),
      creators: offChainMetadata.properties.creators,
      offchainPropertiesFiles: [
        {
          type: 'image/jpg',
          uri: item.imageUrl
        }
      ]
    }
    return createSftInput
    // console.log(createSftInput)
  })
  console.log(parsed_items)
  await sftConfigModel.insertMany(parsed_items)

}
main()
//   logger.debug('URI of SFT metadata', uri)

//   // Create CreateSftInput object
//   const createSftInput: CreateSftInput = {
//     name: sftConfig.collection.name,
//     symbol: sftConfig.collection.symbol,
//     uri,
//     // do we need it? it is optional
//     // tokenOwner: metaplex.identity().publicKey,
//     sellerFeeBasisPoints: sftConfig.sellerFeeBasisPoints,
//     creators,
//     // maxSupply: UNLIMINTED_SUPPLY,
//     // MCC props
//     isCollection: true,
//     collection: sftConfig.mccAddress,
//     collectionAuthority: collectionSigner, // FIXME owner of the collection should sign it
//     collectionIsSized: false
//   }

// const createSftInput  = {
//     name: processed_item["marketHashName"],
//     symbol: "",
//     uri: "https://api.bokor.games/metadata/63f6d41857062ba39e14e8b9",
//     // do we need it? it is optional
//     // tokenOwner: metaplex.identity().publicKey,
//     sellerFeeBasisPoints: 100,
//     creators:,
//     // maxSupply: UNLIMINTED_SUPPLY,
//     // MCC props
//     isCollection: true,
//     collectionIsSized: false
//   }
