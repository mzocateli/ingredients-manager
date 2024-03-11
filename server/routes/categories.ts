import express, { Request, Response } from 'express';
import { readData, writeData } from '../data';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  const data = readData();
  res.json(data.categories);
});

router.post('/', (req: Request, res: Response) => {
  const data = readData();
  data.categories.push(req.body);
  writeData(data);
  res.json(req.body);
});

router.patch('/:id', (req: Request, res: Response) => {
  const data = readData();
  const index = data.categories.findIndex(category => category.id === Number(req.params.id));

  if (index === -1) {
    res.status(404).json({ error: 'Category not found' });
  }

  data.categories[index] = { ...data.categories[index], ...req.body };
  writeData(data);
  res.json(data.categories[index]);
});

export default router;
