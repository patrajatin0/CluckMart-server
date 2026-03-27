import express from "express"
import Order from "../models/order.js"
import Product from "../models/product.js"
import Authentication from "../middleware/authencticaion.js"
const OrderRouter = express.Router()

OrderRouter.post("/", Authentication, async (req, res) => {
    try {
        const { items, shippingAddress } = req.body;


        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) return res.status(404).json({ message: `Product not found: ${item.productId}` });

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price,
            });
            totalAmount += product.price * item.quantity;
        }

        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            totalAmount,
            shippingAddress,
        });

        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


OrderRouter.get("/my", Authentication, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate("items.product", "name price image")
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


OrderRouter.get("/:id", Authentication, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user", "name email")
            .populate("items.product", "name price image");

        if (!order) return res.status(404).json({ message: "Order not found" });


        if (order.user._id.toString() !== req.user._id.toString())
            return res.status(403).json({ message: "Not authorized" });

        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


OrderRouter.put("/:id/status", Authentication, async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
export default OrderRouter

