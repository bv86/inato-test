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
  start_date: string;

  @property({
    type: 'date',
    required: true,
  })
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
  study_type: string;

  @property({
    type: 'string',
    required: true,
  })
  primary_purpose: string;


  constructor(data?: Partial<Trial>) {
    super(data);
  }
}

export interface TrialRelations {
  // describe navigational properties here
}

export type TrialWithRelations = Trial & TrialRelations;
