import { IBlock } from './block.model';

export interface IRoutine {
  blocks?: IBlock[];
  endDate?: number;
  startDate?: number;
  number?: number;
  uid?: string;
}
