import type { AccessTokenBuilder, AddRandomUser, AddRandomUserRes } from '@/domain/contracts'
import type { Hasher } from '@/interactions/contracts/cryptography'
import type { AddUserRepo } from '@/interactions/contracts/db'
import type { IdBuilder } from '@/interactions/contracts/id/id-builder'

export class AddRandomUserUseCase implements AddRandomUser {
  constructor (
    private readonly hasher: Hasher,
    private readonly idBuilder: IdBuilder,
    private readonly addUserRepo: AddUserRepo,
    private readonly accessTokenBuilder: AccessTokenBuilder
  ) {}

  async perform (): Promise<AddRandomUserRes> {
    const ids: string[] = []
    for (let i = 0; i < 3; i++) {
      ids.push(this.idBuilder.build().id)
    }
    const { hash: password } = await this.hasher.hashing(ids[0])
    const email = `${ids[1]}@convidado.com`
    const createdAt = new Date(); const updatedAt = createdAt
    const id = ids[2]
    await this.addUserRepo.add({
      id, password, email, name: 'Convidado', createdAt, updatedAt, role: 'user'
    })
    const { token } = await this.accessTokenBuilder.perform(id)
    return { userName: 'Convidado', id, token }
  }
}
