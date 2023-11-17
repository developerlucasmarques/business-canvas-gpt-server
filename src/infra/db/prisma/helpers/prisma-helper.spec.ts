import { PrismaClient } from '@prisma/client'
import { PrismaHelper as sut } from './prisma-helper'

let prisma: PrismaClient

describe('Prisma Helper', () => {
  afterAll(async () => {
    await sut.disconnect()
  })

  it('Should reconnect if Prisma down', async () => {
    prisma = await sut.getCli()
    expect(prisma).toBeInstanceOf(PrismaClient)
    await sut.disconnect()
    prisma = await sut.getCli()
    expect(prisma).toBeInstanceOf(PrismaClient)
  })
})
