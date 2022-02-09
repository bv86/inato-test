import fetch from 'node-fetch';
import {Country} from './models';

/**
 * This allows us to properly catch errors and set an error exit status if it
 * happens
 */
module.exports = main()
  .then(() => {
    process.exit(0);
  })
  .catch((err: Error) => {
    console.error(`Execution failed: ${err.message}`);
    process.exit(1);
  });

/**
 * Our main entry point function
 */
async function main(): Promise<void> {
  const BASE_URL = process.env['INATO_SERVER_URL'] ?? 'http://localhost:3000';
  // First, let's check our args
  const [, , ...rest] = process.argv;
  if (rest.length !== 1) {
    throw new Error(`You must pass exactly one parameter to get-current`);
  }
  const code = rest[0].toUpperCase();
  const countryFilter = JSON.stringify({
    where: {
      code,
    },
  });
  // Get the country
  const country = await fetch(`${BASE_URL}/countries/?filter=${countryFilter}`)
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        return undefined;
      }
    })
    .catch(err => {
      console.error(`Could not connect to server`);
    });
  // If the country is not valid, throw Error
  if (country.length === 0) {
    throw new Error(`No country found with code ${code}`);
  }
  const trialsFilter = JSON.stringify({
    where: {
      country: country[0].code,
    },
  });
  // Get the ongoing trials for that country
  const trials = await fetch(
    `${BASE_URL}/trials/?filter=${trialsFilter}&ongoing=true`,
  )
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        return undefined;
      }
    })
    .catch(err => {
      console.error(`Could not connect to server`);
    });
  // Throw error if no current trials for that country
  if (trials.length === 0) {
    throw Error(`No current trial for country ${country[0].name}`);
  }
  // Display the list of trials by name
  console.log(
    trials.map((t: Country) => `${t.name}, ${country[0].name}`).join('\n'),
  );
}
