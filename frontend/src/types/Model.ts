import { OrderQuery, PageQuery, TimeQuery } from '.';

export interface ModelType {
  typeId: string;
  typeName: string;
}

export interface Model {
  modelId: string;
  type: ModelType;
  modelName: string;
  timestamp: Date;
}

export interface ModelQuery extends TimeQuery, PageQuery, OrderQuery {
  modelName?: string;
  modelType?: string;
}
