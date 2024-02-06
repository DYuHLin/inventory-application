const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SellerSchema = new Schema({
    name: {type: String, required: true},
    shoe: {type: Schema.Types.ObjectId, ref: 'Shoe', required: true},
    established: {type: Date, default: Date.now}
});

SellerSchema.virtual("url").get(function () {
    return `/catalog/seller/${this._id}`;
});

module.exports = mongoose.model("Seller", SellerSchema);