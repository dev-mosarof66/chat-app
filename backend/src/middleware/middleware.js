import jwt from "jsonwebtoken";

export const middleware = async (req, res, next) => {
    const token = req.cookies.token;

    try {
        if (!token) {
            return res.status(401).json({
                message: "Login session expired.",
                data: null,
                success: false
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.id

        if (!req.user) {
            return res.status(401).json({ message: "Your internet connection is unstable." });
        }

        next();
    } catch (error) {
        console.error("Error in middleware:", error.message);
        return res.status(401).json({ message: "Login session expired." });
    }
};
