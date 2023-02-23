"use strict";
exports.__esModule = true;
exports.getItemsByAppId = exports.itemModel = exports.itemSchema = void 0;
var shared_1 = require("./shared");
exports.itemSchema = new shared_1.MongoSchema({
    appId: { type: Number, required: true },
    marketHashName: { type: String, required: true },
    name: { type: String, required: true },
    // projectExternalUrl: { type: String },
    imageUrl: { type: String, required: true },
    direct_buy: { type: Boolean, required: true },
    enabled: { type: Boolean, required: true },
    startTime: { type: Date },
    endTime: { type: Date },
    lastRecordedPrice: { type: Number },
    priceSOL: { type: Number },
    tags: [
        {
            category: { type: String, required: true },
            value: { type: String, required: true }
        },
    ]
});
exports.itemModel = (0, shared_1.createMoogoseModel)("processed_item", exports.itemSchema);
function getItemsByAppId(appId) {
    return exports.itemModel.find({ appId: appId });
}
exports.getItemsByAppId = getItemsByAppId;
console.log(getItemsByAppId(570));
