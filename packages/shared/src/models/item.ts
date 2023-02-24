import { PublicKey } from "@solana/web3.js";
import { Item } from "../types";
import { createMoogoseModel, MongoSchema } from "./shared";


export const itemSchema = new MongoSchema<Item>(
  {},
  { timestamps: true, strict: false }
);

export const itemModel = createMoogoseModel<Item>("processed_item", itemSchema);

export async function getItemsByAppId(appId: number, limit: number = -1) {
  if (limit < 0) {
    return await itemModel.find({ appId: appId }).exec();
  }
  return await itemModel.find({ appId: appId }).limit(limit).exec();
}
