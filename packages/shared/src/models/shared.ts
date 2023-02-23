import mongoose, {
  Schema,
  SchemaDefinition,
  SchemaDefinitionType,
  SchemaOptions,
} from "mongoose";
import * as dotenv from "dotenv";
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

export function createMoogoseModel<T>(mongo_collection_name: string, mongoSchema: Schema) {
  return mongoose.createConnection(MONGO_URL).model<Schema<T>>(mongo_collection_name, mongoSchema);
}
