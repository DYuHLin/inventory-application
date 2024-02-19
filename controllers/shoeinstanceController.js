const ShoeInstances = require("../models/shoeInstance");
const Shoe = require("../models/shoe");
const Brand = require("../models/brand");
const Seller = require("../models/seller");
const {body, validationResult} = require("express-validator");

const asynchandler = require("express-async-handler");

exports.shoeinstance_list_get = asynchandler(async (req, res, next) => {
    const shoeInstances = await ShoeInstances.find().populate("shoe").exec();

    res.render("shoeinstance_list", {title: "Shoe instances", shoeinstance: shoeInstances});
});

//create new shoe instance
exports.shoeinstance_create_get = asynchandler(async (req, res, next) => {
    const [allShoes, shoeInstances] = await Promise.all([
        Shoe.find({}, "title").sort({title: 1}).exec(),
        ShoeInstances.find().populate("shoe").exec()
    ]);

    res.render("shoeinstance_form", {title: "Shoe Create", shoes: allShoes, shoeinstance: shoeInstances});
});

exports.shoeinstance_create_post = [
    //validating fields
    body("shoe", "shoe should not be empty")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("manufactured", "manufactured should not be empty")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("status")
        .escape(),
    body("restocking", "Invalid Date")
        .optional({ values: "falsy" })
        .isISO8601()
        .toDate(),

    asynchandler(async (req, res, next) => {
        const errors = validationResult(req);
        // validationResult
        const shoeinstance = new ShoeInstances({
            shoe: req.body.shoe,
            manufactured: req.body.manufactured,
            status: req.body.status,
            restocking: req.body.restocking
        });

        if(!errors.isEmpty()){
            const [allShoes, shoeInstances] = await Promise.all([
                Shoe.find({}, "title").sort({title: 1}).exec(),
                ShoeInstances.find().populate("shoe").exec()
            ]);
        
            res.render("shoeinstance_form", {title: "Shoe Create", shoes: allShoes, shoeinstance: shoeInstances});
        } else {
            await shoeinstance.save();
            res.redirect(shoeinstance.url);
        }
    }),
];

//get single shoe instance
exports.get_shoeinstance_detail = asynchandler(async (req, res, next) => {
    const [allShoes, shoeInstances] = await Promise.all([
        Shoe.find({}, "title").sort({title: 1}).exec(),
        ShoeInstances.findById(req.params.id).populate("shoe").exec()
    ]);

    if(shoeInstances === null) {
        const err = new Error("Shoe instance not found");
        err.status = 404;
        return next(err);
    };

    res.render("shoeinstance_detail", {title: "Shoe instance detail", shoe_instance: shoeInstances} )
});

//update shoe instance
exports.shoeinstance_update_get = asynchandler(async (req, res, next) => {
    const [allShoes, shoeInstance] = await Promise.all([
        Shoe.find({}, "title").sort({title: 1}).exec(),
        ShoeInstances.findById(req.params.id).populate("shoe").exec()
    ]);

    if(shoeInstance === null) {
        const err = new Error("Shoe instance not found");
        err.status = 404;
        return next(err);
    };

    res.render("shoeinstance_form", {title: "Shoe Create", shoes: allShoes, shoeinstance: shoeInstance});
});

exports.shoeinstance_update_post = [
    body("shoe", "shoe should not be empty")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("manufactured", "manufactured should not be empty")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("status")
        .escape(),
    body("restocking", "Invalid Date")
        .optional({ values: "falsy" })
        .isISO8601()
        .toDate(),

    asynchandler(async (req, res, next) => {
        const errors = validationResult(req);
        // validationResult
        const shoeinstance = new ShoeInstances({
            shoe: req.body.shoe,
            manufactured: req.body.manufactured,
            status: req.body.status,
            restocking: req.body.restocking,
            _id: req.params.id
        });

        if(!errors.isEmpty()){
            const [allShoes, shoeInstances] = await Promise.all([
                Shoe.find({}, "title").sort({title: 1}).exec(),
                ShoeInstances.find().populate("shoe").exec()
            ]);
        
            res.render("shoeinstance_form", {title: "Shoe Create", shoes: allShoes, shoeinstance: shoeInstances});
        } else {
            const updateShoeInstance = await ShoeInstances.findByIdAndUpdate(req.params.id, shoeinstance, {})
            res.redirect(updateShoeInstance.url);
        }
    }),
];

//shoe delete instance
exports.shoeinstance_delete_get = asynchandler(async (req, res, next) => {
    const shoeInstance = await ShoeInstances.findById(req.params.id).populate("shoe").exec();

    if(shoeInstance === null){
        res.redirect("/catalog/shoesinstance");
    };

    res.render("shoeinstance_delete", {title: "delete shoe instance", shoe_instance: shoeInstance});
});

exports.shoeinstance_delete_post = asynchandler(async (req, res, next) => {
    await ShoeInstances.findByIdAndDelete(req.body.shoeinstanceid);
    res.redirect("/catalog/shoeinstance");
});