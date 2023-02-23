import { PublicKey } from "@solana/web3.js";
import { createMoogoseModel, MongoSchema } from "./shared";

export interface Trait {
  appId: number;
  enabled: boolean;
  category: string;
  potentialValues: string[];
}

export const traitSchema = new MongoSchema<Trait>({}, {strict: false});

export const traitModel = createMoogoseModel<Trait>("game_traits", traitSchema);
