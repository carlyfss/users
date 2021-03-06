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
} from '@nestjs/common';
import ErrorException from '@shared/exceptions/ErrorException';
import ValidationException from '@shared/exceptions/ValidationException';
import CreateAddressService from '@modules/addresses/services/CreateAddressService';
import CreateAddressDTO from '@modules/addresses/models/dtos/CreateAddressDTO';
import UpdateAddressDTO from '@modules/addresses/models/dtos/UpdateAddressDTO';
import { Delete, Query } from '@nestjs/common/decorators/http';
import { Address } from '@fireheet/entities/typeorm/users';
import UpdateAddressService from '../../../../services/UpdateAddressService';
import DeleteAddressService from '../../../../services/DeleteAddressService';
import AddressesCacheVerifierService from '../../../../services/AddressesCacheVerifierService';
import UUIDValidationInterceptor from '../../../../../../shared/infra/http/interceptor/UUIDValidationInterceptor';
import PaginationInterceptor from '../../../../../../shared/infra/http/interceptor/PaginationInterceptor';

@Controller()
@UseFilters(ErrorException, ValidationException)
@UseInterceptors(ClassSerializerInterceptor, UUIDValidationInterceptor)
export default class AddressesController {
  constructor(
    private readonly createAddress: CreateAddressService,
    private readonly updateAddress: UpdateAddressService,
    private readonly deleteAddress: DeleteAddressService,
    private readonly addressesCacheVerifier: AddressesCacheVerifierService,
  ) {}

  @Post(':user_id')
  async create(
    @Param('user_id')
    user_id: string,
    @Body() data: CreateAddressDTO,
  ): Promise<Partial<Address>> {
    return this.createAddress.execute(user_id, data);
  }

  @Patch(':user_id')
  async update(
    @Param('user_id')
    user_id: string,
    @Query('address_id') address_id: string,
    @Body() data: UpdateAddressDTO,
  ): Promise<Partial<Address>> {
    return this.updateAddress.execute(user_id, address_id, data);
  }

  @Get(':user_id')
  @UseInterceptors(PaginationInterceptor)
  async show(
    @Param('user_id') user_id: string,
    @Query('address_id') address_id: string,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ): Promise<Partial<Address> | Partial<Address>[] | undefined> {
    return this.addressesCacheVerifier.execute(
      user_id,
      address_id,
      offset,
      limit,
    );
  }

  @Delete(':user_id')
  async delete(
    @Param('user_id') user_id: string,
    @Query('address_id') address_id: string,
  ): Promise<Partial<Address>> {
    return this.deleteAddress.execute(user_id, address_id);
  }
}
