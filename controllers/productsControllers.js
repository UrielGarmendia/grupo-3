const { v4: uuidv4 } = require ("uuid")
const fs = require ("fs")
const path = require('path');
const productsListPath = path.join(__dirname,"../data/products.json");
const productsList = JSON.parse(fs.readFileSync(productsListPath,"utf-8"));

const { validationResult } = require('express-validator');

const productsControllers = {
    index: (req,res) => {
        //enviara la lista de todos los productos
        // console.log(req.session.userLogged);
        res.render('home-shop', { productos: productsList, user: req.session.userLogged });
    },

    carrito: (req, res) => {
        res.render('carrito', { productos: productsList, user: req.session.userLogged });
    },

    createProducts: (req, res) => {
        //enviara el formulario para crear el producto
        res.render("products/formulario-de-carga", { user: req.session.userLogged });
    },

    productsId: (req, res) => {
        //enviara la informacion de un producto segun su ID
        let id = req.params.id;
        let producto = productsList.find(producto => producto.id == id);
        // console.log('------Si aparece: Cannot read properties of undefined. Ignorar el error--------');
        res.render("detalle-producto", { producto, productos: productsList, user: req.session.userLogged });
    },

    newProducts: (req,res) => {
        //recepcion de informacion cargada en el form  de "createProducts"
        // console.log(req.session.userLogged);
        const resultValidation = validationResult(req);

        if (resultValidation.errors.length > 0) {
            res.render("products/formulario-de-carga", { 
                errors: resultValidation.mapped(),
                oldData: req.body,
                user: req.session.userLogged
            });
        };


        let product = req.body;
        let image = req.file.filename;

        product.id = uuidv4();
        product.image = image;

        if (resultValidation.errors.length == 0) {
            productsList.push(product);

            fs.writeFileSync(productsListPath, JSON.stringify(productsList, null, 2))

           
            res.redirect('/products');
        }
    },
    modifyProducts: (req,res) =>{
        // envio del formulario para modificar el producto
       let id = req.params.id;
       let producto = productsList.find(producto => producto.id == id);

        res.render("products/formulario-de-edicion", { producto, user: req.session.userLogged });
    },

    productsUser: (req, res) => {
        // envio de la vista de los productos subidos por el usuario
        res.render('mis-productos', { productos: productsList, user: req.session.userLogged });
    },

    updateProducts: (req,res) => {
        //recepcion y procesado de las modificaciones del producto en el "modifyProducts"
        let id = req.params.id;
        let newProduct = req.body;
        let image = req.file.filename;

        newProduct.id = id;

        for (let index = 0; index < productsList.length; index++) {
            const element = productsList[index];
            if (element.id == id) {
                productsList[index] = newProduct;
                newProduct.image = image;
            }
        }

        fs.writeFileSync(productsListPath, JSON.stringify(productsList, null, 2));

        res.redirect('/products');
    },

    deleteProducts: (req, res) => {
        // proceso de eliminacion de productos
        let id = req.params.id;
        for (let index = 0; index < productsList.length; index++) {
            const element = productsList[index];
            if (element.id == id) {
                productsList.splice(index, 1);
            }
        }

        fs.writeFileSync(productsListPath, JSON.stringify(productsList, null, 2));

        res.redirect('/products/uploadedProducts');
    }
}


module.exports = productsControllers