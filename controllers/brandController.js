const Brand = require("../models/brand");
const Seller = require("../models/seller");
const Shoes = require("../models/shoe");
const Shoeinstances = require("../models/shoeInstance");

const asynchandler = require("express-async-handler");

exports.brand_list_get = asynchandler(async (req, res, next) => {
    const brands = await Brand.find().sort({name: -1}).exec();

    res.render("brand_list", {title: "Brands", brand_list: brands});
});