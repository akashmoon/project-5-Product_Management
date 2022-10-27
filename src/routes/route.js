const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validation = require("../validator/validation");
const middleware = require("../middlewares/auth");
const ProductController = require("../controllers/productController")
const cartController = require("../controllers/cartController")
const orderController = require("../controllers/orderController")
// .......................................... User APIs ...................................//

router.post( "/register",userController.registerUser);
router.post('/login', userController.loginUser)
router.get('/user/:userId/profile',middleware.Authentication, userController.getUserById)
router.put('/user/:userId/profile',middleware.Authentication,userController.updateUserProfile)

// .......................................... Product APIs ...................................//

router.post( "/products",ProductController.createProduct);
router.get( "/products",ProductController.getProduct);
router.get( "/products/:productId",ProductController.getProductId);
router.put('/products/:productId', ProductController.updateProduct)
router.delete('/products/:productId', ProductController.deleteProductById)

// .......................................... Cart APIs ...................................//

router.post( "/users/:userId/cart",middleware.Authentication,cartController.createCart);
router.put('/users/:userId/cart',middleware.Authentication, cartController.updatedCart)
router.get("/users/:userId/cart",middleware.Authentication,cartController.getCart)
router.delete('/users/:userId/cart', middleware.Authentication,cartController.deleteCart)

//............................................Order APIs....................................//

router.post("/users/:userId/orders",middleware.Authentication,orderController.createOrder)
router.put('/users/:userId/orders',middleware.Authentication, orderController.updateOrder)


module.exports = router;



