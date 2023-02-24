import { PublicKey } from "@solana/web3.js";
import { Item, Lootbox } from "../types";
import { itemModel } from "./item";
import { createMoogoseModel, MongoSchema } from "./shared";
import { retry } from 'ts-retry-promise'
export const lootboxSchema = new MongoSchema<Lootbox>(
  {},
  { strict: false, timestamps: true }
);

export const lootboxModel = createMoogoseModel<Lootbox>(
  "game_lootbox",
  lootboxSchema
);

export async function getLootboxsByAppId(appId: number, limit: number = -1) {
  if (limit < 0) {
    return await lootboxModel.find({ appId: appId }).exec();
  }
  return await lootboxModel.find({ appId: appId }).limit(limit).exec();
}

export async function getLootbox(appId: number, name: string) {
  return await lootboxModel.findOne({ appId: appId, name: name }).exec();
}

export async function getLootboxItems(
  appId: number,
  name: string
): Promise<Item[]> {
  try {
    return await retry(async () => {
      const lootbox = (await (
        await lootboxModel.find({ appId: appId, name: name }).exec()
      ).pop()) as Lootbox;
      console.log(lootbox);
      return (await Promise.all(
        lootbox.items.map((item) => {
          return itemModel
            .findOne({ appId: appId, marketHashName: item.marketHashName })
            .exec();
        })
      )) as any;
    }, {retries: 5})
  }
  catch {
    return []
  }
  
}
