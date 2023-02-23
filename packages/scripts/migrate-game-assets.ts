import { MongoClient, MongoClientOptions } from 'mongodb'
import * as dotenv from "dotenv";
import { Item, Trait, Lootbox, itemModel, lootboxModel, traitModel } from 'shared/src/models'
dotenv.config()

const mongoUrl = process.env.MONGO_URL ?? ''
const dbName = process.env.MONGO_DB
const mongo_item_collection = process.env.MONGO_ITEM_COLLECTION ?? ''
const apiKey = process.env.API_KEY
const HARD_CODE_SOL_USD = 24.15

let client: MongoClient | null = null
function getOrCreateMongoClient() {
  const clientOptions: MongoClientOptions = {}
  if (client == null) {
    client = new MongoClient(mongoUrl, clientOptions)
  }
  return client
}
function filterBundle(item: any): boolean {
  let item_string = JSON.stringify(item)
  return item_string.search('bundle') >= 0
}
function filterLootbox(item: any): boolean {
  try {
    return (
      JSON.stringify(item.assetInfo.tags).search('treasure_chest') >= 0 ||
      JSON.stringify(item.assetInfo.tags).search('CSGO_Type_WeaponCase') >= 0
    )
  } catch (error) { 
    console.log(item, error)
  }
  return false
}

async function migrate_data(appId: number) {
  const client = getOrCreateMongoClient()
  await client.connect()
  const db = client.db(dbName)
  const collection = db.collection(mongo_item_collection)
  let items: { [marketHashName: string]: Item } = {}
  // let bundles = {}
  let raw_lootboxs: any[] = []
  let raw_data = await collection.find({ appID: appId }).toArray()

  let traits: { [category: string]: Set<string> } = {}
  raw_data.forEach((data: any) => {
    if (filterLootbox(data)) {
      raw_lootboxs.push(data)
    } else {
      try {
        data.assetInfo.tags.map((tag: any) => {
          if (!traits[tag.category]) {
            traits[tag.category] = new Set()
          }
          traits[tag.category].add(tag.name)
        })
        // console.log(data.median_avg_prices_15days);
        items[data.market_hash_name] = {
          appId: appId,
          marketHashName: data.market_hash_name,
          name: data.market_name,
          imageUrl: data.image,
          direct_buy: true,
          enabled: true,
          // lastRecordedPrice: data.median_avg_prices_15days?.pop()[1],
          // priceSOL: data.median_avg_prices_15days?.pop()[1] / HARD_CODE_SOL_USD,
          tags: data.assetInfo.tags.map((tag: any) => {
            return { category: tag.category, value: tag.name }
          })
        }
      }
      catch {
        console.log(`failed to parse ${data}`)
      }
      
    }
  })
  let lootboxs: Lootbox[] = []
  raw_lootboxs.forEach((lootbox_info: any) => {
    const proper_matches: string[] = lootbox_info.assetInfo.descriptions
      .map((des: any) => (items[des.value] ? des.value : null))
      .filter((a: any) => a !== null)
    let temp_rarity = 1 / proper_matches.length
    lootboxs.push({
      appId: appId,
      enabled: true,
      items: proper_matches.map((a) => ({ marketHashName: a, rarity: temp_rarity })),
      name: lootbox_info.market_hash_name,
      imageUrl: lootbox_info.image,
      // lastRecordedPrice: lootbox_info.median_avg_prices_15days?.pop()[1],
      // priceSOL: lootbox_info.median_avg_prices_15days?.pop()[1] / HARD_CODE_SOL_USD
      priceSOL: 1
    })
  })
  const final_traits: Trait[] = []
  for (const [key, value] of Object.entries(traits)) {
    final_traits.push({
      appId: appId,
      category: key,
      potentialValues: Array.from(value.values()),
      enabled: true
    })
  }
  // console.log(Object.values(items))

  // await itemModel.insertMany(Object.values(items))
  await lootboxModel.insertMany(lootboxs)
  // await traitModel.insertMany(final_traits)
}
migrate_data(570)

