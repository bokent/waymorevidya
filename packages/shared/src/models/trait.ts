import { PublicKey } from "@solana/web3.js";
import { Trait } from "../types";
import { createMoogoseModel, MongoSchema } from "./shared";

export const traitSchema = new MongoSchema<Trait>({}, {strict: false});

export const traitModel = createMoogoseModel<Trait>("game_traits", traitSchema);
