import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import userRoutes from '@/routes/user.routes'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/users', userRoutes)

app.use(/(.*)/, (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Not found',
    })
})

export default app
