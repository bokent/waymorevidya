import { PublicKey } from "@solana/web3.js";
import { createMoogoseModel, MongoSchema } from "./shared";

export interface Bundle {
  appId: number;
  name: string;
  //   imgUrl: string;
  items: string[];
  priceSOL: number;
  lastRecordedPrice?: number;
  enabled: boolean;
  startTime?: Date;
  endTime?: Date;
}

export const bundleSchema = new MongoSchema<Bundle>({}, {strict: false});

export const bundleModel = createMoogoseModel<Bundle>(
  "game_bundle",
  bundleSchema
);

