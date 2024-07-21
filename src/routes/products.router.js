import express from 'express';
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/products.controller.js';
import { adminAuthorize, userAuthorize, premiumAuthorize, canDeleteProductOrUpdate, premiumAndAdminAuthorize} from '../middlewares/auth.middleware.js';
import errorHandlerMiddleware from '../middlewares/errors/error.middleware.js';

const router = express.Router();

router.get('/',  errorHandlerMiddleware, getProducts);
router.get('/:pid', errorHandlerMiddleware, getProductById);
router.post('/',  errorHandlerMiddleware, premiumAndAdminAuthorize, addProduct);
router.put('/:pid', errorHandlerMiddleware, canDeleteProductOrUpdate, premiumAuthorize, updateProduct);
router.delete('/:pid', errorHandlerMiddleware,canDeleteProductOrUpdate, deleteProduct);

export default router;