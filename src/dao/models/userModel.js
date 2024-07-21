import mongoose from 'mongoose';

const collection = 'users';

const schema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true, unique: true },
    age: {type: Number, required: true},
    password: {type: String, required: true},
    cart: {type: mongoose.Schema.Types.ObjectId, ref: 'carts', required: false},
    role:{type: String, required:true, default: 'user'},
    documents: [
        {
            name: { type: String, required: false},
            reference: { type: String, required: false }
        },
    ],    
    last_connection: { type: Date, required: false }
})

const userModel = mongoose.model(collection, schema);

export default userModel;