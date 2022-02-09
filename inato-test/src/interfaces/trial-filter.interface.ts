import {Filter} from '@loopback/repository';
import {Trial} from '../models';

/**
 * Custom filter accepting an ongoing parameter on top of the other
 * regular CRUD filters we already have
 */
export interface TrialFilter extends Filter<Trial> {
  /**
   * Should we only return ongoing trials
   */
  ongoing?: boolean;
}
