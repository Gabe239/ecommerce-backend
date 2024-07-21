import DaoFactory from '../dao/factory.js';
import ProductsRepository from './products.repository.js';
import CartsRepository from './carts.repository.js';
import MessagesRepository from './messages.repository.js';
import UserRepository from './user.repository.js';

const productsDao = DaoFactory.getProductsDao();
const cartsDao = DaoFactory.getCartsDao();
const messagesDao = DaoFactory.getMessagesDao();
const userDao = DaoFactory.getUsersDao();

const productsRepository = new ProductsRepository(productsDao);
const cartsRepository = new CartsRepository(cartsDao);
const messagesRepository = new MessagesRepository(messagesDao);
const userRepository = new UserRepository(userDao);

export default {
  productsRepository,
  cartsRepository,
  messagesRepository,
  userRepository,
};