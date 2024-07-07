import express, { Request, Response } from 'express'
import cors from 'cors'
import { PrismaClient, User } from '@prisma/client'
import { Errors } from './errors'
import { isKeyMissed } from './utils/validation'
import { generateRandomString } from './utils/string'

export const prisma = new PrismaClient()

const app = express()
app.use(express.json())
app.use(cors())

// We don't want to return the password within the request
function parseUserForResponse(user: User) {
  const returnData = JSON.parse(JSON.stringify(user))
  delete returnData.password
  return returnData
}

app.post('/users', async (req: Request, res: Response) => {
  try {
    const userData = req.body

    const isUserDataInvalid = isKeyMissed(userData, [
      'username',
      'email',
      'firstName',
      'lastName',
    ])

    if (isUserDataInvalid) {
      return res
        .status(400)
        .json({ error: Errors.ValidationError, data: undefined, success: false })
    }

    // Check if the username is already taken
    const existingUserByUsername = await prisma.user.findUnique({
      where: { username: userData.username },
    })

    if (existingUserByUsername) {
      return res
        .status(409)
        .json({ error: Errors.UsernameAlreadyTaken, data: undefined, success: false })
    }

    // Check if the email is already taken
    const existingUserByEmail = await prisma.user.findFirst({
      where: { email: userData.email },
    })

    if (existingUserByEmail) {
      return res
        .status(409)
        .json({ error: Errors.EmailAlreadyInUse, data: undefined, success: false })
    }

    // If not found, create a new user and member
    const { user } = await prisma.$transaction(async (tx) => {
      const user = await prisma.user.create({
        data: { ...userData, password: generateRandomString(10) },
      })
      const member = await prisma.member.create({ data: { userId: user.id } })
      return { user, member }
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
  try {
    const newUserData = req.body
    const userId = Number(req.params.userId)

    const isUserDataInvalid = isKeyMissed(newUserData, [
      'username',
      'email',
      'firstName',
      'lastName',
    ])

    if (isUserDataInvalid) {
      return res
        .status(400)
        .json({ error: Errors.ValidationError, data: undefined, success: false })
    }

    // Check if the user exists
    const userToUpdate = await prisma.user.findFirst({
      where: { id: userId },
    })

    if (!userToUpdate) {
      return res
        .status(404)
        .json({ error: Errors.UserNotFound, data: undefined, success: false })
    }

    // Check if the username is already taken
    const existingUserByUsername = await prisma.user.findUnique({
      where: { username: newUserData.username },
    })

    if (existingUserByUsername) {
      return res
        .status(409)
        .json({ error: Errors.UsernameAlreadyTaken, data: undefined, success: false })
    }

    // Check if the email is already taken
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: newUserData.email },
    })

    if (existingUserByEmail) {
      return res
        .status(409)
        .json({ error: Errors.EmailAlreadyInUse, data: undefined, success: false })
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId, username: userToUpdate.username },
      data: newUserData,
    })

    return res.json({
      error: undefined,
      data: parseUserForResponse(updatedUser),
      success: true,
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      error: 'ServerError',
      data: undefined,
      success: false,
    })
  }
})

app.get('/users', async (req: Request, res: Response) => {
  try {
    const { email: findEmail } = req.query

    // Check if the email is provided
    if (!findEmail || typeof findEmail !== 'string') {
      return res.status(400).json({
        error: Errors.ClientError,
        data: undefined,
        success: false,
      })
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: findEmail },
    })

    if (!user) {
      return res
        .status(404)
        .json({ error: Errors.UserNotFound, data: undefined, success: false })
    }

    return res
      .status(200)
      .json({ error: undefined, data: parseUserForResponse(user), success: true })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      error: 'ServerError',
      data: undefined,
      success: false,
    })
  }
})

// Get posts "/posts?sort=recent"
app.get('/posts', async (req: Request, res: Response) => {
  try {
    const { sort } = req.query

    if (sort !== 'recent') {
      return res
        .status(400)
        .json({ error: Errors.ClientError, data: undefined, success: false })
    }

    let postsWithVotes = await prisma.post.findMany({
      include: {
        votes: true, // Include associated votes for each post
        memberPostedBy: {
          include: {
            user: true,
          },
        },
        comments: true,
      },
      orderBy: {
        dateCreated: 'desc', // Sorts by dateCreated in descending order
      },
    })

    return res.json({ error: undefined, data: { posts: postsWithVotes }, success: true })
  } catch (error) {
    return res
      .status(500)
      .json({ error: Errors.ServerError, data: undefined, success: false })
  }
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
