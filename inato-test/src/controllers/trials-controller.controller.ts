import {
  Count,
  CountSchema,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {TrialFilter} from '../interfaces';
import {Trial} from '../models';
import {TrialRepository} from '../repositories';

export class TrialsControllerController {
  constructor(
    @repository(TrialRepository)
    public trialRepository: TrialRepository,
  ) {}

  @post('/trials')
  @response(200, {
    description: 'Trial model instance',
    content: {'application/json': {schema: getModelSchemaRef(Trial)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Trial, {
            title: 'NewTrial',
            exclude: ['id'],
          }),
        },
      },
    })
    trial: Omit<Trial, 'id'>,
  ): Promise<Trial> {
    return this.trialRepository.create(trial);
  }

  @get('/trials/count')
  @response(200, {
    description: 'Trial model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Trial) where?: Where<Trial>): Promise<Count> {
    return this.trialRepository.count(where);
  }

  @get('/trials')
  @response(200, {
    description: 'Array of Trial model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Trial, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Trial) filter?: TrialFilter,
    @param.query.boolean('ongoing') ongoing?: boolean,
  ): Promise<Trial[]> {
    if (ongoing !== undefined) {
      const now = new Date();
      filter = filter ?? {};
      if (ongoing) {
        filter.where = Object.assign(filter.where ?? {}, {
          start_date: {lte: now.toISOString()},
          end_date: {gte: now.toISOString()},
        });
      } else {
        filter.where = Object.assign(filter.where ?? {}, {
          or: [
            {start_date: {gt: now.toISOString()}},
            {end_date: {lt: now.toISOString()}},
          ],
        });
      }
    }
    return this.trialRepository.find(filter);
  }

  @patch('/trials')
  @response(200, {
    description: 'Trial PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Trial, {partial: true}),
        },
      },
    })
    trial: Trial,
    @param.where(Trial) where?: Where<Trial>,
  ): Promise<Count> {
    return this.trialRepository.updateAll(trial, where);
  }

  @get('/trials/{id}')
  @response(200, {
    description: 'Trial model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Trial, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Trial, {exclude: 'where'})
    filter?: FilterExcludingWhere<Trial>,
  ): Promise<Trial> {
    return this.trialRepository.findById(id, filter);
  }

  @patch('/trials/{id}')
  @response(204, {
    description: 'Trial PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Trial, {partial: true}),
        },
      },
    })
    trial: Trial,
  ): Promise<void> {
    await this.trialRepository.updateById(id, trial);
  }

  @put('/trials/{id}')
  @response(204, {
    description: 'Trial PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() trial: Trial,
  ): Promise<void> {
    await this.trialRepository.replaceById(id, trial);
  }

  @del('/trials/{id}')
  @response(204, {
    description: 'Trial DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.trialRepository.deleteById(id);
  }
}
