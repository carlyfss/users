import { Address } from '@fireheet/entities/typeorm/users';
import { AbstractRepository, EntityRepository, getRepository } from 'typeorm';
import {
  PAGINATION_LIMIT,
  PAGINATION_OFFSET,
} from '../../../../../shared/config/DefaultValues';
import CreateAddressDTO from '../../../models/dtos/CreateAddressDTO';
import IAddressesRepository from '../../../repositories/IAddressesRepository';

@EntityRepository(Address)
export default class AddressesRepository
  extends AbstractRepository<Address>
  implements IAddressesRepository
{
  private readonly ormRepository = getRepository(Address);

  public async create(
    user_id: string,
    data: CreateAddressDTO,
  ): Promise<Address> {
    const mergedData = { ...data, user_id };

    const address = this.ormRepository.create(mergedData);

    return this.ormRepository.save(address);
  }

  public async update(address: Address): Promise<Address> {
    address.updated_at = new Date();

    return this.ormRepository.save(address);
  }

  public async delete(address: Address): Promise<Address> {
    address.deleted_at = new Date();

    return this.ormRepository.save(address);
  }

  public async findByID(id: string): Promise<Address | undefined> {
    return this.ormRepository.findOne({ where: { id } });
  }

  public async findByStreetAndPostalCode(
    user_id: string,
    street: string,
    number: number,
    postal_code: string,
  ): Promise<Address | undefined> {
    return this.ormRepository.findOne({
      where: {
        user_id,
        street,
        number,
        zip_code: postal_code,
      },
    });
  }

  findUserAddresses(
    user_id: string,
    offset = PAGINATION_OFFSET,
    limit = PAGINATION_LIMIT,
  ): Promise<Address[]> {
    return this.ormRepository.find({
      where: { user_id },
      skip: offset,
      take: limit,
    });
  }
}
