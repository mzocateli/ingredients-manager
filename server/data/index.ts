import fs from 'fs';
import { Data } from '../../src/types';

export const readData = (): Data => {
  return JSON.parse(fs.readFileSync('data.json', 'utf8'));
};

export const writeData = (data: Data) => {
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
};
