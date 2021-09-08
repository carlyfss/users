import { BadRequestException, Injectable } from '@nestjs/common';
import { Address } from '@fireheet/entities';
import { EventEmitter2 } from '@nestjs/event-emitter';
import CreateAddressDTO from '../dtos/CreateAddressDTO';
import AddressesRepository from '../infra/typeorm/repositories/AddressesRepository';
import UsersRepository from '../../users/infra/typeorm/repositories/UsersRepository';

@Injectable()
export default class CreateAddressService {
  constructor(
    private readonly addressesRepository: AddressesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async execute(
    user_id: string,
    data: CreateAddressDTO,
  ): Promise<Address> {
    const userExists = await this.usersRepository.findByID(user_id);

    if (!userExists) {
      throw new BadRequestException(
        `User with id "${user_id}" does not exists!`,
      );
    }

    const address = await this.addressesRepository.create(user_id, data);

    userExists.main_address_id = address.id;

    await this.usersRepository.update(userExists);

    this.eventEmitter.emit('address.created', userExists.id);

    return address;
  }
}