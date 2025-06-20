import { Router } from 'express'
import { UserController } from '@/controllers/user.controller'
import validateBody from '@/middlewares/validate.middleware'
import { createUserDTO } from '@/usecases/create-user/create-user.dto'

const router = Router()
const userController = new UserController()

router.post('/', validateBody(createUserDTO), userController.createUser)

export default router
