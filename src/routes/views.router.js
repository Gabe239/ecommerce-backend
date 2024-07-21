import express from 'express';
import { addLogger } from '../middlewares/logger.middleware.js';
import { adminAuthorize, userAuthorize, premiumAuthorize, canDeleteProductOrUpdate, premiumAndAdminAuthorize, cookieAuthenticateJWT } from '../middlewares/auth.middleware.js';
import {
  renderHome,
  renderRealTimeProducts,
  renderProductsPage,
  addToCart,
  renderCart,
  renderChat,
  renderRegister,
  renderLogin,
  insertMockProducts,
  loggerTest,
  editUser,
  removeProductFromCart
} from '../controllers/views.controller.js';

const router = express.Router();
router.use(addLogger);

router.get('/', cookieAuthenticateJWT, renderHome);
router.get('/realtimeproducts', cookieAuthenticateJWT, renderRealTimeProducts);
router.get('/products', cookieAuthenticateJWT, renderProductsPage);
router.post('/products/:productId/add-to-cart', cookieAuthenticateJWT, addToCart);
router.get('/cart', cookieAuthenticateJWT, renderCart);
router.get('/chat', cookieAuthenticateJWT, renderChat);
router.get('/register', renderRegister);
router.get('/login', renderLogin);
router.get('/insertMockProducts', cookieAuthenticateJWT, insertMockProducts);
router.get('/loggerTest', cookieAuthenticateJWT, loggerTest);
router.get('/editUser', cookieAuthenticateJWT, adminAuthorize, editUser);
router.delete('/cart/removeProductCart/:pid',cookieAuthenticateJWT, removeProductFromCart)

export default router;

