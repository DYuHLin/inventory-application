const ShoeInstances = require("../models/shoeInstance");
const Shoes = require("../models/shoe");
const Brands = require("../models/brand");
const Sellers = require("../models/seller");

const asynchandler = require("express-async-handler");

exports.shoeinstance_list_get = asynchandler(async (req, res, next) => {
    const shoeInstances = await ShoeInstances.find().populate("shoe").exec();

    res.render("shoeinstance_list", {title: "Shoe instances", shoeinstance: shoeInstances});
});