const productModel = require("../models/productModel")
const mongoose = require("mongoose")
const { isValidObjectId } = require('mongoose')

const { uploadFile, isValid, isValidFiles, isValidRequestBody, nameRegex, numRegex } = require("../validator/validation")


// *************************************************CREATE PRODUCT*******************************************
const createProduct = async function (req, res) {
    try {
        let data = req.body
        let files = req.files
        if (!isValidFiles(files))
            return res.status(400).send({ status: false, Message: "Please provide user's profile picture" })
        //------------------------------------- Distructuring------------------------------//
        const { title, description, price, currencyId, currencyFormat,
            style, availableSizes, installments } = data
         //----------------------------------- All validation------------------------------//
         if (!isValidRequestBody(data)) {
             return res.status(400).send({ status: false, msg: "please provide the Details" })
         }
         //    --------------------------Title validation----------------------------------//
         if (!isValid(title)) {
             return res.status(400).send({ status: false, msg: "please enter the title" })
         }
         if (!nameRegex.test(title))
             return res.status(400).send({ status: false, message: "title should contain alphabets only." })
         const checktitle = await productModel.findOne({ title: title })
         if (checktitle)
             return res.status(400).send({ status: false, msg: "title is already present" })
         // -------------------------------Description validation--------------------------//
         if (!isValid(description)) {
             return res.status(400).send({ status: false, msg: "please enter the description" })
            }
        // -------------------------------Price validation---------------------------------//
            if (!isValid(price)) {
                return res.status(400).send({ status: false, msg: "please enter price" })
            }
            if (!Number(price)) {
                return res.status(400).send({ status: false, msg: "please provide numerical price" })
            }
        // -------------------------------currencyId validation----------------------------------//
            if (!isValid(currencyId)) {
                return res.status(400).send({ status: false, msg: "please provide currencyId" })
            }
            if (currencyId != "INR") {
                return res.status(400).send({ status: false, msg: "please provide valid currencyId" })
            }
        // -------------------------------currencyFormat validation-----------------------------//
            if (!currencyFormat) {
                return res.status(400).send({ status: false, msg: "please provide currencyFormet" })
            }
            if (currencyFormat !== "₹") {
                return res.status(400).send({ status: false, msg: 'currencyFormat should be "₹" ' })
            }
        // -------------------------------style validation---------------------------------------//
            let bodyFromReq = JSON.parse(JSON.stringify(data));
            if (bodyFromReq.hasOwnProperty("style"))
                if (!isValid(style)) return res.status(400).send({ status: false, Message: "Please provide style field", })
        // -------------------------------availableSizes validation-----------------------------//
        if (!availableSizes) {
            return res.status(400).send({ status: false, msg: "please provide availableSizes" })
        }
        if (availableSizes.length < 1) {
            return res.status(400).send({ status: false, msg: "please enter size of product" })
        }
        sizeArr = availableSizes.replace(/\s+/g, "").split(",")

        let arr = ["S", "XS", "M", "X", "L", "XXL", "XL"]
        let flag
        for (let i = 0; i < sizeArr.length; i++) {
            flag = arr.includes(sizeArr[i])
        }
        if (!flag) {
            return res.status(400).send({ status: false, data: "Enter a valid size S or XS or M or X or L or XXL or XL ", });
        }
        data['availableSizes'] = sizeArr
        // -------------------------------installments validation-----------------------------//
        if ((installments ||installments==="")){
            if (!isValid(installments))
                return res.status(400).send({ status: false, Message: "Please provide installments" })
        if (!numRegex.test(installments)) {
            return res.status(400).send({ status: false, msg: "please provide installement only numercial value" })
        }
    }
        // -------------------------------files validation------------------------------------//
        
        let url = await uploadFile(files[0])
        data['productImage'] = url 
        const product = await productModel.create(data)
        return res.status(201).send({ status: true, message: "product create successfully", data: product })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}
//*********************************************GET PRODUCT************************************ *//

const getProduct = async function (req, res) {
    try {
        const  data = req.query;
        let { size, name, priceGreaterThan, priceLessThan,priceSort} = data
        const obj = { isDeleted: false }

        let checkQueryParams = Object.keys(data)
        let arr = ["priceGreaterThan", "priceLessThan", "name", "size","priceSort"]
        for (let i = 0; i < checkQueryParams.length; i++) {
            let update = arr.includes(checkQueryParams[i])
            if (!update) {
                return res.status(400).send({ status: false, message: "you can only update priceLessThan,priceGreaterThan,size,name" })
            }
        }
        const availableSizes = size
        if (availableSizes) {
            let newSize = size.split(",").map((ele) => ele.trim())
            obj.availableSizes = {$in:newSize}
        }
        if (size !== undefined) {
            if (!isValid(size)) {
                return res.status(400).send({ status: false, message: "please enter proper size" })
            }
        }
        let title = name
        if (title)
         obj.title = { $regex: name, $options: "i" }
        if (name !== undefined) {
            if (!isValid(name)) {
                return res.status(400).send({ status: false, message: "please enter proper name" })
            }
        }

        if (priceGreaterThan && priceLessThan) {
            obj.price = { $gte: priceGreaterThan, $lte: priceLessThan }
        }
        else if (priceGreaterThan) {
            obj.price = { $gte: priceGreaterThan }
        }
        else if (priceLessThan) {
            obj.price = { $lte: priceLessThan }
        }
        if (priceGreaterThan !== undefined) {
            if (!isValid(priceGreaterThan)) {
                return res.status(400).send({ status: false, message: "please enter proper maximum price" })}
        
        if (isNaN(priceGreaterThan)) {
            return res.status(400).send({ status: false, message: "please enter proper maximum price" }) }
    }
        if (priceLessThan !== undefined) {
            if (!isValid(priceLessThan)) {
                return res.status(400).send({ status: false, message: "please enter proper minimum price" })}
        if (isNaN(priceLessThan)) {
            return res.status(400).send({ status: false, message: "please enter proper minimum price" })
        }
    }
        if (priceSort !== undefined) {
            if (!["1", "-1"].includes(priceSort)) {
                return res.status(400).
                send({ status: false, message: "please enter the price sort value for ascending order gives 1 or for descending order gives " })
            }
        }
        if (priceSort) {
            price = priceSort
            let priceDetails = await productModel.find(obj).sort({ price: price })
            if (priceDetails.length === 0) {
            return res.status(400).send({ status:false, message: "no product found for the given query" })
            }
            return res.status(200).send({ status: true, message: "success", data: priceDetails })
        }

        if (priceGreaterThan || priceLessThan) {
            let priceDetails = await productModel.find(obj).sort({ price: 1 })
            if (priceDetails.length ===0)
                return res.status(400).send({ status:false, message: "no product found for the given query" })
            return res.status(200).send({ status: true, message: "success", data: priceDetails })
        }
        let priceDetails = await productModel.find(obj)
        if (priceDetails.length === 0)
            return res.status(400).send({ status:false, message: "no product found for the given query" })

        return res.status(200).send({ status: true, message: "success", data: priceDetails })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
//*********************************************GET PRODUCT BY ID*********************************//

const getProductId = async function (req, res) {
    try {
        let productId = req.params.productId
        if (!isValidObjectId(productId))
            return res.status(400).send({ status: false, message: "Please provide a valid productId." })

        const productDetails = await productModel.findById(productId)
        if (!productDetails)
            return res.status(404).send({ status: false, message: "No such product found in the database." })
        if (productDetails.isDeleted === true)
            return res.status(400).send({ status: false, message: "This productDetails has already been deleted." })
        return res.status(200).send({ status: true, message: "Success", data: productDetails })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
// **********************************************UPDATE PRODUCT*************************************//

const updateProduct = async function (req, res) {
    try {
        let productId = req.params.productId
        let data = req.body
        let files = req.files
        // ------------------------------------All validation-----------------------------------------------

        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, msg: "please provide valid productId" })
        }
        let productData = await productModel.findById({ _id: productId })
        if (!productData)
            return res.status(404).send({ status: false, message: "product is not found in the DATABASE." })
        if (productData.isDeleted == true)
            return res.status(400).send({ status: false, msg: "Product is already deleted." })
        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Please provide data for update" });
        }
        // -------------------------------------Destructuring---------------------
        let { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments } = data

        let bodyFromReq = JSON.parse(JSON.stringify(data));
        let newObj = {}
        // --------------------------------------Title validation------------------------------//
        if (bodyFromReq.hasOwnProperty("title")) {
            if (!isValid(title)) {
                return res.status(400).send({ status: false, msg: "Provide the title" })
            }
            if (!nameRegex.test(title))
                return res.status(400).send({ status: false, message: "title should contain alphabets only." })
            const titleData = await productModel.findOne({ title: title })
            if (titleData) return res.status(400).send({ status: false, msg: `${title} is already present` })
        }
        newObj["title"] = title
        //   --------------------------------------description validation------------------------------//
        if (bodyFromReq.hasOwnProperty("description"))
            if (!isValid(description)) {
                return res.status(400).send({ status: false, msg: "please enter the description" })
            }
        newObj["description"] = description
        //   --------------------------------------price validation------------------------------//
        if (bodyFromReq.hasOwnProperty("price")) {
            if (!isValid(price)) {
                return res.status(400).send({ status: false, msg: "please enter the price" })
            }
            if (!Number(price)) {
                return res.status(400).send({ status: false, msg: "please provide numerical price" })
            }
            if (price <= 0) {
                return res.status(400).send({ status: false, msg: "please should not be zero" })
            }
            newObj["price"] = price
        }
        //   --------------------------------------currencyId validation------------------------------//
        if (bodyFromReq.hasOwnProperty("currencyId")) {
            if (!isValid(currencyId)) {
                return res.status(400).send({ status: false, msg: "please provide currencyId" })
            }
            if (currencyId != "INR") {
                return res.status(400).send({ status: false, msg: "please provide valid currencyId" })
            }
            newObj["currencyId"] = currencyId
        }
        //   --------------------------------------currencyFormat validation------------------------//
        if (bodyFromReq.hasOwnProperty("currencyFormat")) {
            if (!currencyFormat) {
                return res.status(400).send({ status: false, msg: "please provide currencyFormet" })
            }
            if (currencyFormat !== "₹") {
                return res.status(400).send({ status: false, msg: 'currencyFormat should be "₹" ' })
            }
            newObj["currencyFormat"] = currencyFormat
        }
        //---------------------------------check if isFreeShipping is present or not--------//

        if (isFreeShipping || isFreeShipping === "") {
            if (!isValid(isFreeShipping))
                return res.status(400).send({ status: false, message: "isFreeShipping cant be empty" })
            if (!isFreeShipping.toLowerCase().match(/^(true|false|True|False|TRUE|FALSE)$/))
                return res.status(400).send({
                    status: false,
                    message: "Please provide isFreeShipping true/false",
                })
            newObj["isFreeShipping"] = isFreeShipping
        }
        //------------------------------------style validation-----------------------------------------//
        if (bodyFromReq.hasOwnProperty("style"))
            if (!isValid(style))
                return res.status(400).send({ status: false, msg: " please Provide the style " })
        newObj["style"] = style
        //------------------------------------Installments validation---------------------------------//
        if (installments ||installments==="") {
                if (!isValid(installments)) return res.status(400).send({ status: false, Message: "Please provide installments" })
            if (!numRegex.test(installments)) {
                return res.status(400).send({ status: false, msg: "please provide installement only numercial value" })
            }
            newObj["installments"] = installments
        }
        //------------------------------------availableSizes validation--------------------------------//
        if (availableSizes) {
            let size = availableSizes.split(",")
            if (!Array.isArray(size)) return res.status(400).send({ status: false, msg: "availableSizes should be array of strings" })
            let Size = ['S', 'XS', 'M', 'X', 'L', 'XXL', 'XL']
            const subtrim = size.map(element => {
                return element.trim()
            })
            for (const element of subtrim) {   //for of loop
                if (Size.includes(element) === false) return res.status(400).send({ status: false, msg: 'Sizes should be in ["S", "XS", "M", "X", "L", "XXL", "XL"]' })
            }
        }
        let uploadedFileURL
        if (files) {
            if (files && files.length > 0) {
                let url = await uploadFile(files[0])
                data['profileImage'] = url
            }
            newObj['productImage'] = uploadedFileURL
        }

        //-----------------------------------------updation part-------------------------------------------//
        const updateProduct = await productModel.findByIdAndUpdate({ _id: productId }, { $set: newObj, $push: { availableSizes: availableSizes } }, { new: true })
        return res.status(200).send({ status: true, message: "Product updated", data: updateProduct })
    }
    catch (error) {
        return res.status(500).send({ status: false, err: error.message })
    }
}
// **********************************************DELETE PRODUCT*************************************//

const deleteProductById = async function (req, res) {
    try {
        let productId = req.params.productId
        if (!isValidObjectId(productId)) return res.status(400).send({ status: false, message: "Please provide a valid productId." })
        let product = await productModel.findById(productId)
        if (!product) return res.status(400).send({ status: false, message: "product is not found" })
        if (product.isDeleted === true) return res.status(400).send({ status: false, message: "This product is already deleted." })

        await productModel.findOneAndUpdate(
            { _id: req.params.productId },
            { isDeleted: true, deletedAt: Date.now() })
        return res.status(200).send({ status: true, message: "product deleted succesfully." })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
module.exports = { createProduct, getProduct, getProductId, updateProduct, deleteProductById }