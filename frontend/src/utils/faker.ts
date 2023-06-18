import { faker } from '@faker-js/faker';
import {
  Device,
  Label,
  Model,
  ModelType,
  Score,
  Record as TRecord,
} from '../types';
import { Pagination } from '../types/Pagination';
import { Result } from '../types/Result';

async function sleep(timeout: number): Promise<void> {
  return new Promise((res, _rej) => {
    setTimeout(res, timeout);
  });
}

const audio = [
  'https://assets.mixkit.co/active_storage/sfx/1133/1133-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/1117/1117-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/2997/2997-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/1110/1110-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/1129/1129-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/2102/2102-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/275/275-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/1114/1114-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/268/268-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/1924/1924-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/2857/2857-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/2858/2858-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/1123/1123-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/1121/1121-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/1660/1660-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/1118/1118-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/1119/1119-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/1126/1126-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/1127/1127-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/2577/2577-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/1131/1131-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/1122/1122-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/1120/1120-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/1113/1113-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/1111/1111-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/1137/1137-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/2585/2585-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/1128/1128-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/1115/1115-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/1124/1124-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/221/221-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/1112/1112-preview.mp3',
];

const fakeStorage: {
  types: Record<string, ModelType>;
  models: Record<string, Model>;
  devices: Record<string, Device>;
  labels: Record<string, Label>;
  records: Record<string, TRecord>;
} = {
  types: {},
  models: {},
  devices: {},
  labels: {},
  records: {},
};

export function fakeModelType(id?: string): ModelType {
  if (id && fakeStorage.types[id]) {
    return fakeStorage.types[id];
  }

  const type = {
    typeId: faker.string.uuid(),
    typeName: faker.lorem.word(),
  };

  fakeStorage.types[type.typeId] = type;
  return type;
}

export function fakeModel(id?: string): Model {
  if (id && fakeStorage.models[id]) {
    return fakeStorage.models[id];
  }

  const model = {
    modelId: id ?? faker.string.uuid(),
    modelName: 'Model ' + faker.lorem.word(),
    type: fakeModelType(),
    timestamp: faker.date.past(),
  };

  fakeStorage.models[model.modelId] = model;
  return model;
}

export function fakeDevice(id?: string): Device {
  if (id && fakeStorage.devices[id]) {
    return fakeStorage.devices[id];
  }

  const device = {
    deviceId: id ?? faker.string.uuid(),
    deviceName: 'Device ' + faker.lorem.word(),
    currentModel: Math.random() > 0.5 ? fakeModel() : undefined,
    timestamp: faker.date.past(),
  };

  fakeStorage.devices[device.deviceId] = device;
  return device;
}

export function fakeLabel(id?: string): Label {
  if (id && fakeStorage.labels[id]) {
    return fakeStorage.labels[id];
  }

  const keys = Object.keys(fakeStorage.labels);
  if (keys.length > 20) {
    const idx = Math.floor(Math.random() * keys.length);
    return fakeStorage.labels[keys[idx]];
  }

  const label = {
    labelId: id ?? faker.string.uuid(),
    labelName: faker.lorem.word(),
  };

  fakeStorage.labels[label.labelId] = label;
  return label;
}

export function fakeScores(labels: string[]): Score[] {
  const lbs = labels.map(fakeLabel);

  return lbs.map((label) => ({
    label,
    score: Math.random(),
  }));
}

export function fakeResult(
  id?: string,
  record?: TRecord,
  model?: Model,
): Result {
  const num = Math.round(Math.random() * 20);
  const labels = [...Array(num).keys()].map(() => fakeLabel().labelId);

  return {
    resultId: id ?? faker.string.uuid(),
    record: record ?? fakeRecord(),
    model: model ?? fakeModel(),
    scores: fakeScores(labels),
    timestamp: faker.date.past(),
  };
}

export function fakeRecord(id?: string): TRecord {
  if (id && fakeStorage.records[id]) {
    return fakeStorage.records[id];
  }

  const record: TRecord = {
    recordId: id ?? faker.string.uuid(),
    device: fakeDevice(),
    temperature: faker.number.int({ min: 0, max: 40 }),
    humidity: faker.number.int({ min: 0, max: 80 }),
    imageFilePath: faker.image.url(),
    audioFilePath: audio[Math.floor(Math.random() * audio.length)],
    audioFft: '',
    location: `${faker.number.float({
      min: 35.40488172230458,
      max: 36.54731312512536,
    })},${faker.number.float({
      min: 137.93948634025696,
      max: 140.51303360872402,
    })}`,
    timestamp: faker.date.past(),
  };

  const num = Math.round(Math.random() * 5);
  const results = [...Array(num).keys()].map(() =>
    fakeResult(faker.string.uuid(), record),
  );
  record.results = results;

  fakeStorage.records[record.recordId] = record;
  return record;
}

export async function fakeRecords(
  prop?:
    | undefined
    | {
        timeout?: number;
        limit?: number;
        page?: number;
        orderBy?: string;
        orderAsc?: boolean;
      },
): Promise<Pagination<TRecord>> {
  const {
    timeout = 200,
    limit = 10,
    page = 1,
    orderBy = 'timestamp',
    orderAsc = true,
  } = prop ?? {};

  await sleep(timeout);

  let records: TRecord[];
  if (Object.keys(fakeStorage.records).length < 70) {
    const num = Math.round(Math.random() * 70);
    records = [...Array(num).keys()].map(() => fakeRecord());
  } else {
    records = Object.values(fakeStorage.records);
  }

  if (orderBy == 'id') {
    records.sort((a, b) => a.recordId.localeCompare(b.recordId));
  } else if (orderBy == 'timestamp') {
    records.sort((a, b) => a.timestamp.valueOf() - b.timestamp.valueOf());
  } else if (orderBy == 'device') {
    records.sort((a, b) =>
      a.device.deviceName.localeCompare(b.device.deviceName),
    );
  } else if (orderBy == 'temperature') {
    records.sort((a, b) => a.temperature - b.temperature);
  } else if (orderBy == 'humidity') {
    records.sort((a, b) => a.humidity - b.humidity);
  }

  if (!orderAsc) {
    records.reverse();
  }

  const items = records.slice(limit * (page - 1), limit * page);

  return new Pagination(items, records.length, limit, page);
}
