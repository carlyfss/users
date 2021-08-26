import { User } from '@fireheet/entities';
import { Test, TestingModule } from '@nestjs/testing';
import FakeCacheProvider from '../../../shared/providers/CacheProvider/fakes/FakeCacheProvider';
import UsersCacheProvider from '../../../shared/providers/CacheProvider/implementations/users/UsersCacheProvider';
import CreateUserDTO from '../dtos/CreateUserDTO';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ListUserService from './ListUserService';
import UsersCacheVerifierService from './UsersCacheVerifierService';

const userModel: CreateUserDTO = {
  name: 'jon',
  email: 'email1',
  password: '123',
  document_number: '123',
  role_id: '123',
  birthdate: new Date(),
};

let usersCacheVerifier: UsersCacheVerifierService;
let usersCacheProvider: UsersCacheProvider;
let usersRepository: UsersRepository;
let user: User;

describe('AddressesCacheVerifierService', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersRepository,
          useValue: new FakeUsersRepository(),
        },
        {
          provide: UsersCacheProvider,
          useValue: new FakeCacheProvider(),
        },
        UsersCacheVerifierService,
        ListUserService,
      ],
    }).compile();

    usersCacheVerifier = module.get<UsersCacheVerifierService>(
      UsersCacheVerifierService,
    );

    usersRepository = module.get<UsersRepository>(UsersRepository);

    usersCacheProvider = module.get<UsersCacheProvider>(UsersCacheProvider);

    user = await usersRepository.create(userModel);
  });

  it('should be able to list a cached user', async () => {
    const cacheGet = jest.spyOn(usersCacheProvider, 'get');
    const cacheStore = jest.spyOn(usersCacheProvider, 'store');

    await usersCacheVerifier.execute(user.id);

    expect(cacheStore).toHaveBeenCalledTimes(1);

    await usersCacheVerifier.execute(user.id);

    expect(cacheGet).toHaveBeenCalledTimes(2);
  });
});