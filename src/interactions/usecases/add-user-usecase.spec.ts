import type { FetchUserByEmailRepo } from '../contracts/db'
import type { UserModel } from '@/domain/models/db-models'
import { User, type UserDto } from '@/domain/entities/user'
import { AddUserUseCase } from './add-user-usecase'
import { left, right } from '@/shared/either'

jest.mock('@/domain/entities/user/user', () => ({
  User: {
    create: jest.fn(() => {
      return right({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
    })
  }
}))

const makeFakeUserDto = (): UserDto => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeFetchUserByEmailRepo = (): FetchUserByEmailRepo => {
  class FetchUserByEmailRepoStub implements FetchUserByEmailRepo {
    async fetchByEmail (email: string): Promise<null | UserModel> {
      return await Promise.resolve(null)
    }
  }
  return new FetchUserByEmailRepoStub()
}

interface SutTypes {
  sut: AddUserUseCase
  fetchUserByEmailRepoStub: FetchUserByEmailRepo
}

const makeSut = (): SutTypes => {
  const fetchUserByEmailRepoStub = makeFetchUserByEmailRepo()
  const sut = new AddUserUseCase(fetchUserByEmailRepoStub)
  return { sut, fetchUserByEmailRepoStub }
}

describe('AddUser UseCase', () => {
  it('Should call User Entity with correct values', async () => {
    const { sut } = makeSut()
    const createSpy = jest.spyOn(User, 'create')
    await sut.perform(makeFakeUserDto())
    expect(createSpy).toHaveBeenCalledWith(makeFakeUserDto())
  })

  it('Should return a Error if create User fails', async () => {
    const { sut } = makeSut()
    jest.spyOn(User, 'create').mockReturnValueOnce(
      left(new Error('any_message'))
    )
    const result = await sut.perform(makeFakeUserDto())
    expect(result.value).toEqual(new Error('any_message'))
  })

  it('Should call FetchUserByEmailRepo with correct email', async () => {
    const { sut, fetchUserByEmailRepoStub } = makeSut()
    const fetchByEmailSpy = jest.spyOn(fetchUserByEmailRepoStub, 'fetchByEmail')
    await sut.perform(makeFakeUserDto())
    expect(fetchByEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
