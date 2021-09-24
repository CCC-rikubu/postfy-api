import { RouteOptions } from 'fastify'
import * as controllers from '../controllers'
import * as middleware from '../middleware'

type RouteConfig = Record<string, RouteOptions>

const routes: RouteConfig = {
  healthCheck: {
    method: 'GET',
    url: '/health',
    handler: (_, res) => {
      res.status(200).send()
    },
  },
  signup: {
    method: 'POST',
    url: '/signup',
    handler: controllers.signup,
  },
  login: {
    method: 'POST',
    url: '/login',
    handler: controllers.login,
  },
  getMyUsers: {
    method: 'GET',
    url: '/user/me',
    preHandler: [middleware.validateRequest],
    handler: controllers.getMyUsers,
  },
  getAllUsers: {
    method: 'GET',
    url: '/user',
    preHandler: [middleware.validateRequest],
    handler: controllers.getAllUsers,
  },
  getPost: {
    method: 'GET',
    url: '/posts',
    handler: controllers.getPost,
  },
  postPost: {
    method: 'POST',
    url: '/post',
    preHandler: [middleware.validateRequest],
    handler: controllers.postPost,
  },
}

export const renderRoutes = Object.values(routes)
