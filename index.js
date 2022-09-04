import express from 'express' ;
import bodyParser from 'body-parser' ;
import mongoose from 'mongoose' ;
import dotenv from 'dotenv' ;
import cors from 'cors' ;
import AuthRoute from './Routes/AuthRoute.js' ;
import UserRoute from './Routes/UserRoute.js' ;
import PostRoute from './Routes/PostRoute.js' ;
import UploadRoute from './Routes/UploadRoute.js' ;

const app = express() ;
app.use(bodyParser.json({limit:'30mb', extended:true})) ;
app.use(bodyParser.urlencoded({limit:'30mb', extended:true})) ;
app.use(cors()) ;

dotenv.config() ;

mongoose
    .connect(
        process.env.MONGO_DB,
        {useNewUrlParser: true , useUnifiedTopology: true}
    )
    .then(() => app.listen(process.env.PORT || 3000, () => console.log(`Listning to post ${process.env.PORT}`)))
    .catch(err => console.log(`Database error ${err}`))

app.use('/auth', AuthRoute) ;
app.use('/user', UserRoute) ;
app.use('/post', PostRoute) ;
app.use('/upload', UploadRoute) ;