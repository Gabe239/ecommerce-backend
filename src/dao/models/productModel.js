import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
const collection = 'products'

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    stock: { type: Number, required: true },
    category: {type: String, required: true},
    availability: {type: Boolean, required: true, default: true},
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'users', default: 'admin' }
});

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(collection, productSchema);

export default productModel;