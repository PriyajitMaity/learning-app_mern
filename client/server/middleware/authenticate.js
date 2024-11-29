const jwt =require("jsonwebtoken");

const verifyToken =(token, secret) =>{
    return jwt.verify(token, secret);
}

const authenticate =(req, res, next) =>{
    const authHeader =req.headers.authorization;
    // console.log('authHeader', authHeader)

    if(!authHeader){
        return res.status(401).json({success: false, msg: "User is not authenticated"});
    }

    const token = authHeader.split(" ")[1];
    try{
        const payload =verifyToken(token, "JWT_SECRET")
        req.user =payload;
        next();
    }catch{
        res.status(401).json({
            success: false,
            msg: "Token is not valid"
        })
    }
}
module.exports =authenticate;