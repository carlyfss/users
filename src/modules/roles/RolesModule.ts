import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role } from '@fireheet/entities/typeorm/users';
import RolesRepository from './infra/typeorm/repositories/RolesRepository';
import RolesController from './infra/http/routes/controllers/RolesController';
import RolesGrpcController from './infra/grpc/routes/controllers/RolesGrpcController';
import ListAllRolesService from './services/ListAllRolesService';
import ListRoleService from './services/ListRoleService';
import RedisConfig from '../../config/RedisConfig';
import ListRoleByNameService from './services/ListRoleByNameService';
import AMQPProviderModule from '../../shared/providers/AMQPProvider/AMQPProviderModule';
import RolesCacheVerifierService from './services/RolesCacheVerifierService';
import RolesCacheProvider from './providers/CacheProvider/implementations/RolesCacheProvider';
import CacheProviderModule from '../../shared/providers/CacheProvider/CacheProviderModule';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Role, RolesRepository]),
    CacheModule.register(RedisConfig),
    AMQPProviderModule,
    CacheProviderModule,
  ],
  controllers: [RolesController, RolesGrpcController],
  providers: [
    ListAllRolesService,
    ListRoleService,
    ListRoleByNameService,
    RolesCacheProvider,
    RolesCacheVerifierService,
  ],
  exports: [TypeOrmModule],
})
export default class RolesModule {}
