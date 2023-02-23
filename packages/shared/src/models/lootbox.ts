import { PublicKey } from "@solana/web3.js";
import { createMoogoseModel, MongoSchema } from "./shared";

export interface Lootbox {
  appId: number;
  name: string;
  //   imgUrl: string;
  items: Array<{
    marketHashName: string;
    rarity: number;
  }>;
  priceSOL: number;
  lastRecordedPrice?: number;
  enabled: boolean;
  startTime?: Date;
  endTime?: Date;
}

export const lootboxSchema = new MongoSchema<Lootbox>({}, {strict: false});

export const lootboxModel = createMoogoseModel<Lootbox>(
  "game_lootbox",
  lootboxSchema
);
