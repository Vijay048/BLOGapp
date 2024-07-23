const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            msg:"You are not authenticated."
        })
    }

    jwt.verify(token, process.env.SECRET, async (err, data) => {
        if(err){
            return res.status(403).json({
                msg:"Token is not valid."
            })
        }

        req.userId = data.id
        // console.log("passed")
        next();
    })
}


module.exports = verifyToken