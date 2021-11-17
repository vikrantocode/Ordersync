const jwt = require('jsonwebtoken')

const authorizedRoles = [ "magentoUser", "admin" ];

module.exports = (req, res, next) => {
    try {
        const token = req.header("x-auth-token")
        if(!token) return res.status(401).json({ error : "ACCESS DENIED : No Authentication Token Provided" })
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if(!verified) return res.status(400).json({ error : "ACCESS DENIED : Token Verification Failed" })
        if(!authorizedRoles.includes(verified.role)) return res.status(403).json({ error : "ACCESS DENIED : You're not Authorized to Access this API." })
        req.user = verified.id
        next()
    } catch (error) {
        if(error.name === "JsonWebTokenError") return res.status(400).json({ error : "ACCESS DENIED : Invalid Authentication Token" })
        return res.status(500).json(error)
    }
}