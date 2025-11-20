const jwt = require('jsonwebtoken');



const auth = async (req, res, next) => {
    try {
        const bearerheader = req.headers.authorization;
        if (typeof bearerheader !== 'undefined') {
            const token = bearerheader.split(" ")[1];
            const user = jwt.verify(token, process.env.JWT_TOKEN);
            console.log(token);
            req.token = user;
            next()
        } else {
            return res.status(401).json({message: "No Token provided"});
        }
    } catch (e) {
        return res.status(403).json({message: "Invalid or Expired Token"});
    }
}

module.exports = auth;