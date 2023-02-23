import { PublicKey } from "@solana/web3.js";
import { createMoogoseModel, MongoSchema } from "./shared";

export interface Item {
  appId: number;
  marketHashName: string;
  name: string;
  // projectExternalUrl: string;
  imageUrl: string;
  direct_buy: boolean;
  enabled: boolean;
  startTime?: Date;
  endTime?: Date;
  lastRecordedPrice?: number;
  priceSOL?: number;
  tags?: Array<{
    category: string;
    value: string;
  }>;
}

export const itemSchema = new MongoSchema<Item>({
  appId: { type: Number, required: true },
  marketHashName: { type: String, required: true },
  name: { type: String, required: true },
  // projectExternalUrl: { type: String },
  imageUrl: { type: String, required: true },
  direct_buy: { type: Boolean, required: true },
  enabled: { type: Boolean, required: true },
  startTime: { type: Date },
  endTime: { type: Date },
  lastRecordedPrice: { type: Number },
  priceSOL: { type: Number },
  tags: [
    {
      category: { type: String, required: true },
      value: { type: String, required: true },
    },
  ],
});

export const itemModel = createMoogoseModel<Item>("processed_item", itemSchema);

export async function getItemsByAppId(appId: number, limit: number = -1) {
  if (limit < 0) {
    return await itemModel.find({ appId: appId }).exec();
  }
  return await itemModel.find({ appId: appId }).limit(limit).exec();
}

