export interface ModelType {
  typeId: string;
  typeName: string;
}

export interface Model {
  modelId: string;
  type: ModelType;
  modelName: string;
  modelFilePath: string;
  timestamp: Date;
}
