const Shoe = require("../models/shoe");
const Seller = require("../models/seller");
const Brand = require("../models/brand");
const ShoeInstance = require("../models/shoeInstance");

const asynchandler = require("express-async-handler");

exports.sellers_list_get = asynchandler(async (req, res, next) => {
    const sellers = await Seller.find().sort({name: -1}).exec();

    res.render("seller_list", {title: "Sellers", seller_list: sellers});
});