import { Device } from './device.entity';
import { DiagnosticResult } from './diagnostic-result.entity';
import { Label } from './label.entity';
import { ModelType } from './model-type.entity';
import { Model } from './model.entity';
import { Record } from './record.entity';
import { Score } from './score.entity';
import { User } from './user.entity';

export default [
  User,
  Label,
  ModelType,
  Model,
  Device,
  Record,
  Score,
  DiagnosticResult,
];
