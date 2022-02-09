import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import {readFileSync} from 'fs';
import path from 'path';
import {Country, Trial} from './models';
import {CountryRepository, TrialRepository} from './repositories';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class InatoTestApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  public async loadData() : Promise<void>{
    try {
      /**
       * Using a memory database is easy, but it may be empty to start with,
       * and because I don't want to implement a custom in memory datasource
       * that would use my data as is, I'm reading it here and inserting
       * it into the database.
       * The insertion is asynchronous, so it may not be available right away
       * when the server starts, it's a thing to be aware of.
       */
      const trialsData = readFileSync(`${__dirname}/../../trials.json`,
        {encoding: 'utf-8'})
      const trials = JSON.parse(trialsData);
      const trialRepository = await this.getRepository(TrialRepository);
      trialRepository.createAll(trials as Trial[]).catch(err => {
        console.error(`Failed to insert existing trials in db: ${err.message}`);
      })

      const countriesData = readFileSync(`${__dirname}/../../countries.json`,
        {encoding: 'utf-8'})
      const countries = JSON.parse(countriesData);
      const countryRepository = await this.getRepository(CountryRepository);
      countryRepository.createAll(countries as Country[]).catch(err => {
        console.error(`Failed to insert existing countries in db: ${err.message}`);
      })

    } catch( err ) {
      console.error(`Failed to load existing data: ${err.message}`);
      throw err;
    }
  }
}
