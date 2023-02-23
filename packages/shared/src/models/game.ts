import { PublicKey } from "@solana/web3.js";
import { createMoogoseModel, MongoSchema } from "./shared";

type avaliableBlockchains = "solana" | "ethereum" | "polygon"

export interface Game {
  appId: number;
  mainImage: string;
  background: string;
  mccAddress: string;
  name: string;
  desc: string;
  blockchain: string;
  isPublished: boolean;
}

export const gameSchema = new MongoSchema<Game>({
}, {strict: false, timestamps: true});

export const gameModel = createMoogoseModel<Game>("game", gameSchema);

export async function getGamesByAppId(appId: number) {
  return await gameModel.find({ appId: appId }).exec();
}

export async function getAllGames() {
  return await gameModel.find().exec()
}