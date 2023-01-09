import jwt from 'jsonwebtoken' ;
import dotenv from 'dotenv' ;

dotenv.config() ;

const secret = process.env.JWT_KEY ;

const authMiddleware = async(req, res, next) => {
    const token = req.headers.authorization.split(" ")[1] ;
    console.log(token)
    try {
        if(token){
            const decode = jwt.decode(token, secret) ;
            console.log(decode) ;
            req.body._id = decode?.id ;
        }
        next() ;
    } catch (error) {
        console.log(error) ;
    }
}

export default authMiddleware ;