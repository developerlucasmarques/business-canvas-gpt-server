import request from 'supertest'
import app from '@/main/configs/app'
import type { Request, Response } from 'express'

describe('CORS Middleware', () => {
  it('Should enable CORS', async () => {
    app.get('/test_cors', (req: Request, res: Response) => {
      res.send()
    })
    await request(app)
      .post('/test_cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})
