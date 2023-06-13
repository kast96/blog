import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import multer from 'multer'
import cors from 'cors'
import { loginValidation, postCreateValidation, registerValidation } from './validations/validations'
import {UserController, PostController} from './controllers/index'
import {checkAuth, handleValidationErrors} from './utils/index'

dotenv.config()

const port = process.env.PORT || 8080

mongoose.connect(
  `mongodb+srv://${process.env.LOGIN}:${process.env.PASSWORD}@freecluster.g4ty6e4.mongodb.net/${process.env.BD}?retryWrites=true&w=majority`
).then(() => {
  console.log('db connected')
}).catch((error) => {
  console.log('db connect error:', error)
})

const app = express()

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads')
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname)
  }
})

const upload = multer({storage})

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.get('/auth/me', checkAuth, UserController.me)

app.post('/upload', checkAuth, upload.single('image'), (request, response) => {
  response.json({
    //@ts-ignore
    url: `/uploads/${request.file.originalname}`
  })
})

app.get('/posts', PostController.getAll)
app.get('/posts/tags', PostController.getLastTags)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)

app.listen(port, () => console.log(`Running on port ${port}`))