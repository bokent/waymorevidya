/**
 * Mongoose model for dbc_wallet_portfolio.ts
 */
import { PublicKey } from "@solana/web3.js";
import mongoose, {
  Aggregate,
  AnyKeys,
  AnyObject,
  Callback,
  CallbackError,
  CallbackWithoutResult,
  Connection,
  Document,
  FilterQuery,
  HydratedDocument,
  InsertManyOptions,
  Model,
  PipelineStage,
  ProjectionType,
  QueryOptions,
  QueryWithHelpers,
  Schema,
  SchemaDefinition,
  SchemaDefinitionType,
  SchemaOptions,
  UpdateQuery,
  UpdateWithAggregationPipeline,
  UpdateWriteOpResult,
  startSession,
} from "mongoose";
import { createMoogoseModel, MongoSchema } from "./shared";



interface SftConfig {
  mccAddress: PublicKey;
  collection: {
    name: string;
    symbol: string;
    description: string;
    family?: string;
  };
  sellerFeeBasisPoints: number;
  imgUrl: string;
  projectExternalUrl: string;
  attributes?: Array<{
    trait_type?: string;
    value?: string;
  }>;
  creators: Array<{
    address: PublicKey;
    share: number;
  }>;
  offchainPropertiesFiles?: Array<{
    type: "image/jpg";
    uri: string;
  }>;
}

const sftConfigSchema = new MongoSchema<SftConfig>(
  {
    mccAddress: { index: true},
  },
  {
    collection: "sft_config",
  }
);

export const DbcWalletPortfolioModel = createMoogoseModel<SftConfig>(
  "DbcWalletPortfolioSchema",
  sftConfigSchema
);

export async function fetchSftConfig(
  walletAddress: string
): Promise<SftConfig | null> {
  const portfolio: SftConfig | null =
    await DbcWalletPortfolioModel.findOne<SftConfig>({
      walletAddress,
    }).lean();
  return portfolio;
}
