import type { NextFunction, Request, Response } from 'express'
import type { Middleware } from '@/presentation/contracts'
import type { HttpRequest } from '@/presentation/http/http'

export const adaptMiddleware = (middleare: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: req.headers
    }
    const httpResponse = await middleare.handle(httpRequest)
    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      Object.assign(req.headers, httpResponse.body)
      next()
    } else {
      res.status(httpResponse.statusCode).json({
        name: httpResponse.body.name,
        error: httpResponse.body.message,
        statusCode: httpResponse.statusCode
      })
    }
  }
}
