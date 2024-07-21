import chai from 'chai';
import supertest from 'supertest';
import productsRepository from '../repositories/index.js';
import mongoose from 'mongoose';


import config from '../config/env-config.js';
const mongoUrl = config.mongoUrl;

const expect = chai.expect;
const requester = supertest('http://localhost:8080');
describe('Products Router', () => {
    before(async () => {
        mongoose.connection.collections.products.drop();
    });



    it('should get a list of products', async () => {
        const res = await requester.get('/api/products');
        expect(res.status).to.equal(200);
        expect(res.body.payload).to.be.an('array');
      });

    it('should get a specific product by ID', (done) => {
        const productId = '64f162bc082b727026abdba2'; 

        requester
            .get(`/api/products/${productId}`)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.have.property('title');
                expect(res.body).to.have.property('description');
                expect(res.body).to.have.property('price');
                expect(res.body).to.have.property('thumbnail');
                expect(res.body).to.have.property('code');
                expect(res.body).to.have.property('stock');
                expect(res.body).to.have.property('category');
                expect(res.body).to.have.property('availability');
                done();
            });
    });

    it('should add a new product', async () => {
        const newProduct = {
          title: 'New Product',
          description: 'Description of New Product',
          price: 99.99,
          thumbnail: 'new-product-thumbnail.jpg',
          code: 'NP001', 
          stock: 10, 
          category: 'Electronics', 
          availability: 'In Stock', 
          
        };

        requester
            .post('/api/products')
            .send(newProduct)
            .end((err, res) => {
                expect(res.status).to.equal(201);
                expect(res.body).to.have.property('title', newProduct.title);
                expect(res.body).to.have.property('description', newProduct.description);
                expect(res.body).to.have.property('price', newProduct.price);
                expect(res.body).to.have.property('thumbnail', newProduct.thumbnail);
                expect(res.body).to.have.property('code', newProduct.code);
                expect(res.body).to.have.property('stock', newProduct.stock);
                expect(res.body).to.have.property('category', newProduct.category);
                expect(res.body).to.have.property('availability', newProduct.availability);
                done();
            });
    });

    after(async () => {
        mongoose.connection.collections.products.drop();
    });
});