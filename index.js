import express from "express";
import {create} from "express-handlebars"
 import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import flash from 'connect-flash'
import session from "express-session";
import cookieParser from "cookie-parser";

import AuthRoutes from './routes/auth.js'
import ProductsRoutes from './routes/products.js'

import hbsHelper from './middleware/utilits/index.js'
import varMiddleware from "./middleware/var.js";
import userMiddleware from "./middleware/user.js"


dotenv.config()


const app = express()
app.use(cookieParser())

const hbs = create({defaultLayout: 'main', extname: 'hbs', helpers: hbsHelper})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', './views')
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(flash())
app.use(session({secret: 'men', resave: false, saveUninitialized: false}))
app.use(varMiddleware)
app.use(userMiddleware)

app.use(express.static('public'))

app.use(AuthRoutes)
app.use(ProductsRoutes)

const startApp = ()=>{
    try {
        mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology:true}, ()=> console.log('Db ulandi'))

    const PORT = process.env.PORT ||4100
    app.listen(PORT, () => console.log(`Server ishladi: ${PORT}`))

    } catch (error) {
        console.log(error)

    }
}

startApp()
