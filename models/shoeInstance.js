const mongoose = require('mongoose');
const {DateTime} = require('luxon');

const Schema = mongoose.Schema;

const ShoeInstanceScehma = new Schema({
    shoe: {type: Schema.Types.ObjectId, ref: "Shoe", required: true},
    manufactured: {type: String, required},
    status: {
        type: String,
        required: true,
        enum: ["Unavailable", "Available", "Restocking", "Limited"],
        default: "Available"
    },
    restocking: {type: Date, default: Date.now},
});

ShoeInstanceScehma.virtual("url").get(function () {
    return `/catalog/shoeinstance/${this._id}`;
});

ShoeInstanceScehma.virtual("restocking_formatted").get(function () {
    return DateTime.fromJSDate(this.restocking).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("ShoeInstance", ShoeInstanceScehma);