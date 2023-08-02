import path from 'path'
import express from 'express'
import connectDB from './config/db.js'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
//morgan is used to log the data of requests made to server
import morgan from 'morgan'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import colors from 'colors'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

dotenv.config()

connectDB()

const app = express()

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// app.use(bodyParser.urlencoded({
//     extended:true
// }))
// app.use(bodyParser.json())
app.use(express.json())
// app.use(express.urlencoded({
//     extended:true
// }))

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

app.use('/api/config/paypal', (req, res) => 
    res.send(process.env.PAYPAL_CLIENT_ID)
)

// __dirname is available in JS not in ES6
const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')))

    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')))
} else {
    app.get('/', (req, res) => {
        res.send('API is running...');
    })
}

app.use(notFound)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

// if(process.env.NODE_ENV === 'production') {
//     app.use(express.static("../client/build"))
// }

app.listen(PORT, console.log(`\n----\nServer running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))
