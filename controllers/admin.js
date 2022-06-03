const Product = require('../models/product')
const { validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');


exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        errorMessage: [],
        hasError: false,
    })
}

exports.post_prodcut = (req, res, next) => {
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    const errors = validationResult(req);
    if (!image) {
        return res.status(422).render('admin/edit-product', {
            errorMessage: [{ msg: 'Attatched file is not an image.' }],
            editing: false,
            product: {
                title: title,
                price: price,
                description: description
            },
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            hasError: true,
            validationErrors: []
        })
    }
    const imageUrl = image.path;
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            errorMessage: errors.array(),
            editing: false,
            product: { title: title, imageUrl: imageUrl, price: price, description: description },
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            hasError: true,
        })
    }
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user
    });
    product
        .save()
        .then(result => {
            // console.log(result)
            console.log('Created Product')
            res.redirect('/admin/products')
        }).catch(err => {
            // return res.status(500).render('admin/edit-product', {
            //     errorMessage: [{ msg: 'Database operation failed, please try again.' }],
            //     editing: false,
            //     product: { title: title, imageUrl: imageUrl, price: price, description: description },
            //     pageTitle: 'Add Product',
            //     path: '/admin/add-product',
            //     hasError: true,
            // })
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);

        })
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    const prodId = req.params.id;

    if (!editMode) {
        res.redirect('/')
    }
    Product.findById(prodId)
        .then(products => {
            if (!products) res.redirect('/');
            else {
                res.render("admin/edit-product", {
                    pageTitle: 'Edit Product',
                    path: '/admin/edit-product',
                    editing: editMode,
                    product: products,
                    errorMessage: [],
                    hasError: false,
                });
            }
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const image = req.file;
    const updatedDescription = req.body.description;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            errorMessage: errors.array(),
            editing: true,
            product: {
                _id: prodId,
                title: updatedTitle,
                price: updatedPrice,
                description: updatedDescription
            },
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            hasError: true,
        })
    }
    Product.findById(prodId)
        .then(product => {
            console.log('here', product)
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/')
            }
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDescription;
            if (image) {
                product.imageUrl = image.path;
            }
            return product.save().then(result => {
                res.redirect('/admin/products')
            });
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.deleteProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.deleteOne({ _id: prodId, userId: req.user._id }).then(() => {
        res.status(200).json({ message: 'Success!' });
    }).catch(err => {
        res.status(500).json('Deleting product failed!');
    })
}

exports.getProducts = (req, res, next) => {
    Product.find({ userId: req.user._id })
        .then(products => {
            console.log(products)
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}