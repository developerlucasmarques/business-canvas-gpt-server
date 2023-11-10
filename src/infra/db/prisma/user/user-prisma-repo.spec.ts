import type { UserModel } from '@/domain/models/db-models'
import type { PrismaClient } from '@prisma/client'
import { UserPrismaRepo } from './user-prisma-repo'
import { PrismockClient } from 'prismock'
import { PrismaHelper } from '../helpers/prisma-helper'
import MockDate from 'mockdate'

const makeFakeUserModel = (): UserModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  role: 'user',
  createdAt: new Date(),
  updatedAt: new Date()
})

let prismock: PrismaClient

describe('UserPrisma Repo', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
    prismock = new PrismockClient()
    jest.spyOn(PrismaHelper, 'getCli').mockReturnValue(
      Promise.resolve(prismock)
    )
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should create new User', async () => {
    const sut = new UserPrismaRepo()
    await sut.add(makeFakeUserModel())
    const user = await prismock.user.findUnique({ where: { id: 'any_id' } })
    expect(user).toEqual(makeFakeUserModel())
  })
})
