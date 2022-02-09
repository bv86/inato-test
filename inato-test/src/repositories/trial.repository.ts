import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MemoryDataSource} from '../datasources';
import {Trial, TrialRelations} from '../models';

export class TrialRepository extends DefaultCrudRepository<
  Trial,
  typeof Trial.prototype.id,
  TrialRelations
> {
  constructor(
    @inject('datasources.memory') dataSource: MemoryDataSource,
  ) {
    super(Trial, dataSource);
  }
}
