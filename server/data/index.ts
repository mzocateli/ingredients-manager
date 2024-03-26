import fs from 'fs/promises';
import { Data } from '../../src/types';

let queue: Promise<void> = Promise.resolve();

export const readData = async (): Promise<Data> => {
  const data = await fs.readFile('data.json', 'utf8');
  return JSON.parse(data);
};

export const writeData = (data: Data): void => {
  const jsonData = JSON.stringify(data, null, 2);
  queue = queue.then(() => fs.writeFile('data.json', jsonData));
};
