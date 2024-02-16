const Brand = require("../models/brand");
const Shoes = require("../models/shoe");
const {body, validationResult} = require("express-validator");

const asynchandler = require("express-async-handler");

exports.brand_list_get = asynchandler(async (req, res, next) => {
    const brands = await Brand.find().sort({name: -1}).exec();

    res.render("brand_list", {title: "Brands", brand_list: brands});
});


//get list of shoes
exports.brand_list_get = asynchandler(async (req, res, next) => {
    const brands = await Brand.find({}, "name origin")
        .sort({name: 1})
        .exec();

    res.render("brand_list", {title: "Brand List", brand: brands});
});

//create new brand
exports.brand_create_get = asynchandler(async (req, res, next) => {
    const brands = await Brand.find().sort({name: 1}).exec();

    res.render("brand_form", {title: "Brand Create", brand: brands});
});

exports.brand_create_post = [
    //validating fields
    body("name", "Name should not be empty")
        .trim()
        .isLength({min: 3})
        .escape(),
    body("origin", "Origin should not be empty")
        .trim()
        .isLength({min: 3})
        .escape(),

    asynchandler(async (req, res, next) => {
        const errors = validationResult(req);
        // validationResult

        const brands = new Brand({
            name: req.body.name,
            origin: req.body.origin,
        });

        if(!errors.isEmpty()){
            res.render("brand_form", {title: "Brand Create", brand: brands, errors: errors});
            return;
        } else {
            const brandExists = await Brand.findOne({name: req.body.name}).exec();
            if(brandExists){
                res.redirect(brandExists.url);
            } else {
                await brands.save();
                res.redirect(brands.url);
            }
        }
    }),
];

//get single brand
exports.get_brand_detail = asynchandler(async (req, res, next) => {
    const [brands, shoesInBrands] = await Promise.all([
        Brand.findById(req.params.id).exec(),
        Shoes.find({brand: req.params.id}, "title summary").exec(),
    ]);

    if(brands === null){
        const err = new Error("Brand not found.");
        err.status = 404;
        return next(err);
    };

    res.render("brand_detail", {title: "Brand detail", brand: brands, shoes: shoesInBrands});
});

//update brand
exports.brand_update_get = asynchandler(async (req, res, next) => {
    const brands = await Brand.findById(req.params.id).exec();

    if(brands === null){
        const err = new Error("Brand not found.");
        err.status = 404;
        return next(err);
    };

    res.render("brand_form", {title: "Brand Update", brand: brands});
});

exports.brand_update_post = [
    body("name", "Name should not be empty")
        .trim()
        .isLength({min: 3})
        .escape(),
    body("origin", "Origin should not be empty")
        .trim()
        .isLength({min: 3})
        .escape(),

    asynchandler(async (req, res, next) => {
        const errors = validationResult(req);
        // validationResult

        const brands = new Brand({
            name: req.body.name,
            origin: req.body.origin,
            _id: req.params.id
        });

        if(!errors.isEmpty()){
            res.render("brand_form", {title: "Brand Update", brand: brands, errors: errors});
            return;
        } else {
            const brandExists = await Brand.findOne({name: req.body.name}).exec();
            if(brandExists){
                res.redirect(brandExists.url);
            } else {
                const brandUpdate = await Brand.findByIdAndUpdate(req.params.id, brands, {});
                res.redirect(brandUpdate.url);
            }
        }
    }),
];

//brand delete
exports.brand_delete_get = asynchandler(async (req, res, next) => {
    const [brands, shoesInBrands] = await Promise.all([
        Brand.findById(req.params.id).exec(),
        Shoes.find({brand: req.params.id}, "title summary").exec(),
    ]);

    if(brands === null){
        const err = new Error("Brand not found.");
        err.status = 404;
        return next(err);
    };

    res.render("brand_delete", {title: "Brand delete", brand: brands, shoes: shoesInBrands});
});

exports.brand_delete_post = asynchandler(async (req, res, next) => {
    const [brands, shoesInBrands] = await Promise.all([
        Brand.findById(req.params.id).exec(),
        Shoes.find({brand: req.params.id}, "title summary").exec(),
    ]);

    if(shoesInBrands.length > 0) {
        res.render("brand_delete", {title: "Brand delete", brand: brands, shoes: shoesInBrands});
        return;
    } else {
        await Brand.findByIdAndDelete(req.body.brandid);
        res.redirect("/catalog/brand");
    };
});