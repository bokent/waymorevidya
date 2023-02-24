import { PublicKey } from "@solana/web3.js";
import { Lootbox } from "../types";
import { createMoogoseModel, MongoSchema } from "./shared";



export const lootboxSchema = new MongoSchema<Lootbox>({}, {strict: false, timestamps: true});

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

