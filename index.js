// imports
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import postRoutes from './routes/postRoutes.js'
import userRoutes from './routes/userRoutes.js'
import dotenv from 'dotenv'

// setup
const app = express()
dotenv.config()
mongoose.connect(process.env.CONNECTION_URL)
    .then(() => app.listen(process.env.PORT, () => console.log(`Server running on port: ${process.env.PORT}`)))
    .catch(err => console.log('connection error'))

app.use(express.json({ limit: '30mb', extended: true }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())

// routes
app.get('/', (req, res) => res.send('welcome to memories project'))
app.use('/posts', postRoutes)
app.use('/user', userRoutes)