import { Injectable } from '@nestjs/common';
import { User } from '@fireheet/entities';
import ListUserService from './ListUserService';
import UsersCacheProvider from '../providers/CacheProvider/implementations/UsersCacheProvider';

@Injectable()
export default class UsersCacheVerifierService {
  constructor(
    private readonly userCache: UsersCacheProvider,
    private readonly listUser: ListUserService,
  ) {}

  public async execute(id: string): Promise<Partial<User>> {
    let user: Partial<User>;

    user = await this.userCache.get(id);

    if (!user) {
      user = await this.listUser.execute(id);

      return this.userCache.store(id, user);
    }

    return user;
  }
}
