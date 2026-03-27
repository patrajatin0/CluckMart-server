import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,

    },
    price: {
        type: Number
    },
    category: {
        type: String
    },
    description: {
        type: String
    },
    imageUrl: {
        type: String
    },
    stock: {
        type: Boolean,
        default: true
    }

})

const Product = mongoose.model("Product", ProductSchema)
export default Product