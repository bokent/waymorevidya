"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _a;
exports.__esModule = true;
exports.createMoogoseModel = exports.MongoSchema = void 0;
var mongoose_1 = require("mongoose");
var dotenv = require("dotenv");
dotenv.config();
var MONGO_URL = (_a = process.env.MONGO_URL) !== null && _a !== void 0 ? _a : "";
var MongoSchema = /** @class */ (function (_super) {
    __extends(MongoSchema, _super);
    function MongoSchema(definition, options) {
        var safeOptions = options ? options : {};
        // Force autoIndex and autoCreate to be false for performance.
        safeOptions.autoIndex = false;
        safeOptions.autoCreate = false;
        return _super.call(this, definition, safeOptions) || this;
    }
    return MongoSchema;
}(mongoose_1.Schema));
exports.MongoSchema = MongoSchema;
function createMoogoseModel(mongo_collection_name, mongoSchema) {
    return mongoose_1["default"].createConnection(MONGO_URL).model(mongo_collection_name, mongoSchema);
}
exports.createMoogoseModel = createMoogoseModel;
