import { prisma } from '../helpers/utils'
import { decodeToken } from '../helpers/utils'
import { RouteHandlerMethod } from 'fastify'

export const getPost: RouteHandlerMethod = async (req, res) => {
  try {
    const post = await prisma.post.findMany({
      where: { published: true },
    })
    return res.send({ data: { post } })
  } catch (error) {
    res.status(500).send({ error: 'Cannot fetch posts' })
  }
}

export const postPost: RouteHandlerMethod = async (req, res) => {
  try {
    const { title, content } = req.body as any
    const decodedToken = decodeToken(req.headers.authorization?.split(' ')[1])
    const email = decodedToken?.email
    const result = await prisma.post.create({
      data: {
        title,
        content,
        published: true,
        author: { connect: { email: email } },
      },
    })
    await res.send(result)
  } catch (error) {
    res.status(500).send({ error: 'Cannot post post' })
  }
}
