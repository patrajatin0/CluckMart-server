import express from "express"
import User from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const AuthRoters = express.Router()

AuthRoters.post("/signup", async (req, res) => {
    const { name, email, password, role } = req.body
    try {
        const hassPassoword = await bcrypt.hash(password, 10);
        const user = new User({
            name, password: hassPassoword, email, role
        })
        await user.save()
        res.json({ "message": "SignUp sucessfully..." })

    } catch (error) {
        res.status(404).send("Something went worng")
    }
})
AuthRoters.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const userLogin = await User.findOne({ email })
        if (!userLogin) {
            return res.status(404).send("Invalid Credential")
        }
        const isMatch = await bcrypt.compare(password, userLogin.password)
        if (isMatch) {
            const token = await jwt.sign({ _id: userLogin._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
            res.cookie("token", token)
            res.json({ "message": "Login Sucessfully.." })
        } else {
            res.status(404).send("Invalid Credential")
        }
    } catch (error) {
        res.status(404).send("Something went worng")
    }
})

export default AuthRoters