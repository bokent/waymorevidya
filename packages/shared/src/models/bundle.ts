import { PublicKey } from "@solana/web3.js";
import { Bundle } from "../types";
import { createMoogoseModel, MongoSchema } from "./shared";


export const bundleSchema = new MongoSchema<Bundle>({}, {strict: false});

export const bundleModel = createMoogoseModel<Bundle>(
  "game_bundle",
  bundleSchema
);

