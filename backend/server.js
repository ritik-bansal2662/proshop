import express from 'express'
import connectDB from './config/db.js'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import colors from 'colors'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

dotenv.config()

connectDB()

const app = express()
// app.use(bodyParser.urlencoded({
//     extended:true
// }))
// app.use(bodyParser.json())
app.use(express.json())
// app.use(express.urlencoded({
//     extended:true
// }))


app.get('/', (req, res) => {
    res.send('API is running...');
})

app.use('/api/products', productRoutes)

app.use('/api/users', userRoutes)

app.use(notFound)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

if(process.env.NODE_ENV === 'production') {
    app.use(express.static("../client/build"))
}

app.listen(PORT, console.log(`\n----\nServer running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))
