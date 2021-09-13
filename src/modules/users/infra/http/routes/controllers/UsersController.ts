import {
  Body,
  Controller,
  Patch,
  Post,
  Param,
  UseFilters,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  UsePipes,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import ErrorException from '@shared/exceptions/ErrorException';
import { User } from '@fireheet/entities';
import CreateUserService from '@modules/users/services/CreateUserService';
import ValidationException from '@shared/exceptions/ValidationException';
import CreateUserDTO from '../../../../dtos/CreateUserDTO';
import UpdateUserService from '../../../../services/UpdateUserService';
import UpdateUserDTO from '../../../../dtos/UpdateUserDTO';
import DocumentValidationPipe from '../../pipes/DocumentValidationPipe';
import BirthdateValidationPipe from '../../pipes/BirthdateValidationPipe';
import UserCacheVerifierService from '../../../../services/UsersCacheVerifierService';
import UUIDValidationInterceptor from '../../../../../../shared/infra/http/pipes/UUIDValidationInterceptor';
import DeleteUserService from '../../../../services/DeleteUserService';
import ActivateUserService from '../../../../services/ActivateUserService';

@ApiTags('Users Routes')
@Controller()
@UseFilters(ErrorException, ValidationException)
@UseInterceptors(ClassSerializerInterceptor, UUIDValidationInterceptor)
export default class UsersController {
  constructor(
    private readonly createUser: CreateUserService,
    private readonly updateUser: UpdateUserService,
    private readonly deleteUser: DeleteUserService,
    private readonly activateUser: ActivateUserService,
    private readonly userCacheVerifier: UserCacheVerifierService,
  ) {}

  @Post()
  @UsePipes(DocumentValidationPipe, BirthdateValidationPipe)
  async create(@Body() data: CreateUserDTO): Promise<User> {
    return this.createUser.execute(data);
  }

  @Patch(':user_id')
  async update(
    @Param('user_id')
    user_id: string,
    @Body() data: UpdateUserDTO,
  ): Promise<User> {
    return this.updateUser.execute(user_id, data);
  }

  @Get(':user_id')
  async show(@Param('user_id') user_id: string): Promise<User> {
    return this.userCacheVerifier.execute(user_id);
  }

  @Delete(':user_id')
  async delete(@Param('user_id') user_id: string): Promise<User> {
    return this.deleteUser.execute(user_id);
  }

  @Patch(':user_id/activate')
  async activate(@Param('user_id') user_id: string): Promise<User> {
    return this.activateUser.execute(user_id);
  }
}
