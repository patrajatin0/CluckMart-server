import express from "express"
import Product from "../models/product.js"
import Authentication from "../middleware/authencticaion.js"

const ProductRouter = express.Router()

ProductRouter.post("/product", async (req, res) => {
    const { name, price, category, description, imageUrl, inStock } = req.body
    try {
        const products = new Product({
            name, price, category, description, imageUrl, inStock
        })
        await products.save()
        res.json({ "message": "Successfully saved" })

    } catch (error) {
        res.status(404).send("something went worng")
    }
})
ProductRouter.put("/product/:id", async (req, res) => {
    const { id } = req.params
    const { name, imageUrl, price, stock } = req.body
    try {
        const updateProduct = await Product.findByIdAndUpdate(id, { name, imageUrl, price, stock }, { new: true })
        res.send(updateProduct)
        if (!updateProduct) {
            res.status(500).send("Product is not found")
        }
    } catch (error) {
        res.status(500).send("something went worng")
    }
})
ProductRouter.delete("/product/:id", async (req, res) => {
    const { id } = req.params
    try {
        const deletePoduct = await Product.findByIdAndDelete(id)
        res.send("Delete Successfully...")
    } catch (error) {

    }
})
ProductRouter.get("/product", Authentication, async (req, res) => {
    try {
        const product = await Product.find({})
        res.send(product)

    } catch (error) {
        res.status(400).send("something went worng")
    }
})
ProductRouter.get("/product/:id", async (req, res) => {
    const { id } = req.params
    try {
        const product = await Product.findById(id)
        res.send(product)
    } catch (error) {
        res.status(400).send("something went worng")
    }
})

export default ProductRouter