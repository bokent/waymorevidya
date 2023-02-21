import { MongoClient, MongoClientOptions } from "mongodb";
import axios from "axios";
import dotenv from "dotenv";
import { LimitedConcurrency } from "./helper";
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay});


dotenv.config();

const mongoUrl = process.env.MONGO_URL ?? "";
const dbName = process.env.MONGO_DB;
const mongo_bulk_collection = process.env.MONGO_BULK_COLLECTION ?? "";
const mongo_item_collection = process.env.MONGO_ITEM_COLLECTION ?? "";
const apiKey = process.env.API_KEY;

let client: MongoClient | null = null;
function getOrCreateMongoClient() {
  const clientOptions: MongoClientOptions = {};
  if (client == null) {
    client = new MongoClient(mongoUrl, clientOptions);
  }
  return client;
}

async function fetchMarketItems(appId: number): Promise<any[]> {
  const url = `https://api.steamapis.com/market/items/${appId.toString()}?api_key=${apiKey}`;
  const response = await axios.get(url);
  const { data } = response;
  const items = data.data.filter((item: any) => item.nameID !== null);
  console.log(`Total ${items.length} items`);
  return items;
}

async function fetchMarketItem(
  appId: number,
  market_hash_name: string,
  client: MongoClient,
  worker: number
): Promise<void> {
  const url = `https://api.steamapis.com/market/item/${appId.toString()}/${encodeURIComponent(
    market_hash_name
  )}?api_key=${apiKey}`;
  const response = await axios.get(url);
  const db = client.db(dbName);
  const collection = db.collection(mongo_item_collection);
  await collection.insertOne(response.data);
}

async function insertMarketItems(appId: number): Promise<string[]> {
  const client = getOrCreateMongoClient();
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db(dbName);
    const collection = db.collection(mongo_bulk_collection);
    const items = await fetchMarketItems(appId);
    collection.deleteMany({appID: appId})
    await collection.insertMany(items);
    console.log(`Inserted ${items.length} items into MongoDB`);
    return items.map((a) => a.market_hash_name);
  } catch (err) {
    console.error(err);
  }
  return [];
}

async function checkIdsInBatch(appId: number, market_hash_names: string[]) {
  const client = getOrCreateMongoClient();
  await client.connect();

  const db = client.db(dbName);
  const collection = db.collection(mongo_item_collection);
  const foundMarketHashNames = new Set(
    await collection
      .find({ appID: appId })
      .project({ market_hash_name: 1 })
      .map((a) => a.market_hash_name)
      .toArray()
  );
  const unfoundedMarketHashNames = market_hash_names.filter(
    (a) => !foundMarketHashNames.has(a)
  );
  console.log(
    `importing ${unfoundedMarketHashNames.length} out of ${market_hash_names.length}`
  );
  const allDetails = await LimitedConcurrency.mapAllSettled(
    unfoundedMarketHashNames,
    (currentValue, index, array, worker) =>
      fetchMarketItem(appId, currentValue, client, worker),
  );
  console.log(
    `successes: ${allDetails.filter((a) => a.status == "fulfilled").length}`
  );
  console.log(
    `rejected: ${allDetails.filter((a) => a.status == "rejected").length}`
  );

  await client.close();
  console.log("Disconnected from MongoDB");
}


