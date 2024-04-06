import express, { Request, Response } from 'express'
import cors from 'cors'
import { PrismaClient, User } from '@prisma/client'
import { Errors } from './errors'

const prisma = new PrismaClient()

const app = express()
app.use(express.json())
app.use(cors())

function generateRandomPassword(length: number): string {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'
  const passwordArray = []

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    passwordArray.push(charset[randomIndex])
  }

  return passwordArray.join('')
}

// We don't want to return the password within the request
function parseUserForResponse(user: User) {
  const returnData = JSON.parse(JSON.stringify(user))
  delete returnData.password
  return returnData
}

app.post('/users', async (req: Request, res: Response) => {
  try {
    const userData = req.body

    // Check if the user exists or not
    const existingUserByEmail = await prisma.user.findFirst({
      where: { email: req.body.email },
    })

    if (existingUserByEmail) {
      return res
        .status(409)
        .json({ error: Errors.EmailAlreadyInUse, data: undefined, success: false })
    }

    // If not found, create a new user
    const user = await prisma.user.create({
      data: { ...userData, password: generateRandomPassword(10) },
    })

    return res
      .status(201)
      .json({ error: undefined, data: parseUserForResponse(user), success: true })
  } catch (error) {
    console.log(error)
    // Return a failure error response
    return res.status(500).json({
      error: 'ServerError',
      data: undefined,
      success: false,
    })
  }
})

app.patch('/users/:userId', async (req: Request, res: Response) => {
  res.send([])
})

app.get('/users', async (req: Request, res: Response) => {
  res.send([])
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
