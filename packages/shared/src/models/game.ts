import { PublicKey } from "@solana/web3.js";
import { Game } from "../types";
import { createMoogoseModel, MongoSchema } from "./shared";

export const gameSchema = new MongoSchema<Game>({
}, {strict: false, timestamps: true});

export const gameModel = createMoogoseModel<Game>("game", gameSchema);

export async function getGamesByAppId(appId: number) {
  return await gameModel.find({ appId: appId }).exec();
}

export async function getAllGames(): Promise<Game[]> {
  return await gameModel.find().exec()
}