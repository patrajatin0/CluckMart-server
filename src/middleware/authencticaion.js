import jwt from "jsonwebtoken"

const Authentication = async (req, res, next) => {
    try {
        const token = req.cookies.token

        // ✅ check token exists
        if (!token) {
            return res.status(401).json({
                message: "Please login first"
            })
        }

        // ✅ verify token
        const decodedMessage = await jwt.verify(token, process.env.JWT_SECRET)

        // ✅ attach user data
        req.user = decodedMessage

        next()

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        })
    }
}

export default Authentication