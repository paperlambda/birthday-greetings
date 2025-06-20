import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import userRoutes from '@/routes/user.routes'
import errorHandler from '@/middlewares/error-handler.middleware'
import notFoundHandler from '@/middlewares/not-found.middleware'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/users', userRoutes)

app.use(/(.*)/, notFoundHandler)

app.use(errorHandler)

export default app
