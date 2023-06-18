import { Device, Model, Record, Score, User } from '.';

export interface Result {
  resultId: string;
  record: Record;
  model: Model;
  diagnosticByUser?: User;
  diagnosticByDevice?: Device;
  scores: Score[];
  timestamp: Date;
}
