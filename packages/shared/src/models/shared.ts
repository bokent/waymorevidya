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
import dotenv from "dotenv";
dotenv.config();

const MONGO_URL = process.env.MONGO_URL ?? "";

export class MongoSchema<DocType = any> extends Schema {
    constructor(
      definition?: SchemaDefinition<SchemaDefinitionType<DocType>>,
      options?: SchemaOptions
    ) {
      const safeOptions = options ? options : {};
      // Force autoIndex and autoCreate to be false for performance.
      safeOptions.autoIndex = false;
      safeOptions.autoCreate = false;
  
      super(definition, safeOptions);
    }
  }

export class MongoModel extends mongoose.Model {
    private mongoose_connection: mongoose.Connection;
    public model;
    constructor(mongo_collection_name: string, mongoSchema: MongoSchema) {
        this.mongoose_connection = mongoose.createConnection(MONGO_URL)
        this = this.mongoose_connection.model(mongo_collection_name, mongoSchema);
        super()

    }
}