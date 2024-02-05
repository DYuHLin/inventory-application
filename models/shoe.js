const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const shoeSchema = new Schema({
    title: {type: String, required: true},
    seller: {type: Schema.Types.ObjectId, ref: "Seller", required: true},
    summary: {type: String, required: true},
    brand: {type: Schema.Types.ObjectId, ref: "Brand", required: true}
});

shoeSchema.virtual("url").get(function () {
    return `/catalog/shoe/${this._id}`;
});

module.exports = mongoose.model("Shoe", shoeSchema);