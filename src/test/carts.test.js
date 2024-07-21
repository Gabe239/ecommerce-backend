import chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import productsRepository from '../repositories/index.js';
import cartsRepository from '../repositories/index.js';
import config from '../config/env-config.js';

const mongoUrl = config.mongoUrl;

const expect = chai.expect;
const requester = supertest('http://localhost:8080');



describe('Cart Router', () => {
    let cartId;
  
    before(async () => {
      cartId = '650e245e41c88c9da1f7b8ba';
    });
  
    it('should create a new cart', async () => {
      const response = await requester.post('/api/carts');
      expect(response.status).to.equal(201);
    });
  
    it('should get a cart by ID', async () => {
      const response = await requester.get(`/api/carts/${cartId}`);
      expect(response.status).to.equal(200);
      
    });
  
    it('should add a product to a cart', async () => {
      const productId = '64f1638f800eba5f54657f75';
  
      const response = await requester.post(`/api/carts/${cartId}/productTest/${productId}`);
      expect(response.status).to.equal(200);
    });
  
    it('clear cart', async () => {
  
      const response = await requester.delete(`/api/carts/${cartId}`);
      expect(response.status).to.equal(200);
    });
  
  
    after(async () => {
      
    });
  });