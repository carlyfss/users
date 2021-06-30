import CreateTenantDTO from '@modules/tenants/dtos/CreateTenantDTO';
import { AbstractRepository, EntityRepository, getRepository } from 'typeorm';
import Role from '@fireheet/entities/typeorm/Role';
import IRolesRepository from '../../../repositories/IRolesRepository';

@EntityRepository(Role)
export default class RolesRepository
  extends AbstractRepository<Role>
  implements IRolesRepository
{
  private readonly ormRepository = getRepository(Role);

  public async listAll(): Promise<Role[]> {
    return this.ormRepository.find();
  }

  public async findByID(id: string): Promise<Role | undefined> {
    return this.ormRepository.findOne({ where: { id } });
  }
}