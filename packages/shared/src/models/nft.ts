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

const dbcWalletPortfolioSchema = new MongoSchema<SftConfig>(
  {
    mccAddress: { index: true},
  },
  {
    collection: "sft_config",
  }
);

export const DbcWalletPortfolioModel = new MongoModel<IDbcWalletPortfolio>(
  "DbcWalletPortfolioSchema",
  dbcWalletPortfolioSchema
);

export async function fetchDbcWalletPortfolio(
  walletAddress: string
): Promise<IDbcWalletPortfolio | null> {
  const portfolio: IDbcWalletPortfolio | null =
    await DbcWalletPortfolioModel.findOne<IDbcWalletPortfolio>({
      walletAddress,
    }).lean();
  return portfolio;
}
