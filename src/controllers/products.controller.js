import productsRepository from '../repositories/index.js';
import { io } from '../app.js';
import CustomError from '../middlewares/errors/customError.js';
import {ErrorMessageType, errorCodes, errorMessages} from '../middlewares/errors/errorDictionary.js';
import nodemailer from 'nodemailer';
import config from '../config/env-config.js';

const mailConfig = {
    service: 'gmail',
    auth: {
        user: config.mailing.user,
        pass: config.mailing.password,
    },
}
const transport = nodemailer.createTransport(mailConfig);


const productManager = productsRepository.productsRepository;

export const getProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort;
    const category = req.query.category;
    const availability = req.query.availability;

    let query = {};

    if (req.query.query) {
      query = { type: req.query.query };
    }

    const totalProducts = await productManager.getProductsCount(query);
    const totalPages = Math.ceil(totalProducts / limit);
    const startIndex = (page - 1) * limit;

    const products = await productManager.getProducts(
      query,
      sort,
      limit,
      startIndex,
      category,
      availability
    );

    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    const nextPage = hasNextPage ? page + 1 : null;
    const prevPage = hasPrevPage ? page - 1 : null;
    const prevLink = hasPrevPage
      ? `/api/products?page=${prevPage}&limit=${limit}&sort=${sort}&query=${req.query.query}&category=${category}&availability=${availability}`
      : null;
    const nextLink = hasNextPage
      ? `/api/products?page=${nextPage}&limit=${limit}&sort=${sort}&query=${req.query.query}&category=${category}&availability=${availability}`
      : null;

    const result = {
      status: 'success',
      payload: products,
      totalPages: totalPages,
      prevPage: prevPage,
      nextPage: nextPage,
      page: page,
      hasPrevPage: hasPrevPage,
      hasNextPage: hasNextPage,
      prevLink: prevLink,
      nextLink: nextLink,
    };

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Error al enviar los productos' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productManager.getProductById(productId);

    if (product) {
      return res.status(200).json(product);
    } else {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Error al enviar los productos' });
  }
};
export const addProduct = async (req, res, next) => {
  const newProduct = req.body;

  try {
    const { title, description, price, thumbnail, code, stock, category, availability } = newProduct;

    if (!title || !description || !price || !thumbnail || !code || !stock || !category || !availability) {
      const error = new CustomError(errorMessages.MISSING_DATA.message, errorMessages.MISSING_DATA.status, errorMessages.MISSING_DATA.code);
      throw error;
      
    }

    if (
      typeof title !== 'string' ||
      typeof description !== 'string' ||
      typeof thumbnail !== 'string' ||
      typeof price !== 'number' ||
      typeof code !== 'string' ||
      typeof stock !== 'number' ||
      typeof category !== 'string' ||
      typeof availability !== 'string'
    ) {
      throw errorMessages.INVALID_DATA;
    }

    await productManager.addProduct(newProduct);
    io.emit('product-added', newProduct);
    return res.status(201).json(newProduct);
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
};


export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.pid;
    const updatedProduct = req.body;
    const product = await productManager.getProductById(productId);

    if (product) {
      const { title, description, price, thumbnail, code, stock, category, availability } = updatedProduct;
      await productManager.updateProduct(
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
        availability,
        productId
      );
      io.emit("product-updated", product);
      return res.status(200).json({ ...product, ...updatedProduct });
    } else {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productManager.getProductById(productId);

    if (product) {
      const user = await getUserByProductId(productId); // Implement a function to get the user associated with the product

      if (user && user.role === 'premium') {
        const emailOptions = {
          from: config.mailing.user,
          to: user.email,
          subject: 'Product Deletion Notification',
          text: `The product "${product.title}" has been deleted from our platform.`,
        };

        transport.sendMail(emailOptions, (error, info) => {
          if (error) {
            console.error(error);
          } else {
            console.log(`Email sent: ${info.response}`);
          }
        });
      }

      await productManager.deleteProduct(productId);
      io.emit('product-deleted', product);
      return res.status(200).json(product);
    } else {
      return res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting the product' });
  }
};