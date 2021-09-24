import { RouteHandlerMethod } from 'fastify'
import { prisma } from '../helpers/utils'
import { decodeToken } from '../helpers/utils'

export const getAllUsers: RouteHandlerMethod = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { name: true, email: true },
    })
    return res.send({ data: { users } })
  } catch (error) {
    console.error('users', error)
    res.status(500).send({ error: `Cannot fetch users` })
  }
}

export const getMyUsers: RouteHandlerMethod = async (req, res) => {
  try {
    const decodedToken = decodeToken(req.headers.authorization?.split(' ')[1])
    let user = await prisma.user.findMany({
      where: {
        name: decodedToken?.name,
        email: decodedToken?.email,
      },
      select: { name: true, email: true },
    })
    return res.send({ data: { user } })
  } catch (error) {
    console.error('user', error)
    res.status(500).send({ error: `Cannot fetch user` })
  }
}
