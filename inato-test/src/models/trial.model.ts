import {Entity, model, property} from '@loopback/repository';

@model()
export class Trial extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  country: string;

  @property({
    type: 'date',
    required: true,
  })
  // disable eslint here because the data we have is formatted like this
  // eslint-disable-next-line @typescript-eslint/naming-convention
  start_date: string;

  @property({
    type: 'date',
    required: true,
  })
  // disable eslint here because the data we have is formatted like this
  // eslint-disable-next-line @typescript-eslint/naming-convention
  end_date: string;

  @property({
    type: 'string',
    required: true,
  })
  sponsor: string;

  @property({
    type: 'boolean',
    required: true,
  })
  canceled: boolean;

  @property({
    type: 'string',
    required: true,
  })
  // disable eslint here because the data we have is formatted like this
  // eslint-disable-next-line @typescript-eslint/naming-convention
  study_type: string;

  @property({
    type: 'string',
    required: true,
  })
  // disable eslint here because the data we have is formatted like this
  // eslint-disable-next-line @typescript-eslint/naming-convention
  primary_purpose: string;


  constructor(data?: Partial<Trial>) {
    super(data);
  }
}

export interface TrialRelations {
  // describe navigational properties here
}

export type TrialWithRelations = Trial & TrialRelations;
