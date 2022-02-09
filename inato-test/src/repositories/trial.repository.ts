import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {readFileSync} from 'fs';
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
    try {
      /**
       * Using a memory database is easy, but it's empty to start with,
       * and because I don't want to implement a custom in memory datasource
       * that would use my data as is, I'm reading it here and inserting
       * it into the database.
       * The insertion is asynchronous, so it may not be available right away
       * when the server starts, it's a thing to be aware of.
       */
      const data = readFileSync(`${__dirname}/../../../trials.json`,
        {encoding: 'utf-8'})
      const trials = JSON.parse(data);
      this.createAll(trials as Trial[]).catch(err => {
        console.error(`Failed to insert existing data in db: ${err.message}`);
      })
    } catch( err ) {
      console.error(`Failed to load existing data: ${err.message}`);
      throw err;
    }
  }
}
