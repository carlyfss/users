import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Address } from '@fireheet/entities/typeorm/users';
import RolesModule from '../roles/RolesModule';
import CacheProviderModule from '../../shared/providers/CacheProvider/CacheProviderModule';
import AddressesController from './infra/http/routes/controllers/AddressesController';
import AddressesRepository from './infra/typeorm/repositories/AddressesRepository';
import ListAllAddressesService from './services/ListAllAddressesService';
import UpdateAddressService from './services/UpdateAddressService';
import ListAddressService from './services/ListAddressService';
import CreateAddressService from './services/CreateAddressService';
import DeleteAddressService from './services/DeleteAddressService';
import RedisConfig from '../../config/RedisConfig';
import UsersModule from '../users/UsersModule';
import AMQPProviderModule from '../../shared/providers/AMQPProvider/AMQPProviderModule';
import AddressesCacheVerifierService from './services/AddressesCacheVerifierService';
import AddressesCacheProvider from './providers/implementations/AddressesCacheProvider';
import AddressesEventController from './infra/events/controllers/AddressesEventController';
import UsersCacheProvider from '../users/providers/CacheProvider/implementations/UsersCacheProvider';

@Module({
  imports: [
    RolesModule,
    CacheModule.register(RedisConfig),
    CacheProviderModule,
    TypeOrmModule.forFeature([Address, AddressesRepository]),
    AMQPProviderModule,
    UsersModule,
  ],
  controllers: [AddressesController, AddressesEventController],
  providers: [
    CreateAddressService,
    ListAddressService,
    ListAllAddressesService,
    UpdateAddressService,
    DeleteAddressService,
    AddressesCacheProvider,
    UsersCacheProvider,
    AddressesCacheVerifierService,
  ],
  exports: [TypeOrmModule],
})
export default class AddressesModule {}
