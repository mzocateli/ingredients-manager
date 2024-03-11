import { Request, Response, NextFunction } from 'express';
import { Item } from '../../src/types';

export const validateItem = (req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line prefer-const
  let { name, quantity, unit, expiration }: Item = req.body;
  quantity = Number(quantity);
  if (!name || !quantity || !unit || !expiration) {
    return res.status(400).json({ error: 'Name, quantity, unit, and expiration are required' });
  }

  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Invalid name' });
  }

  if (typeof quantity !== 'number' || quantity <= 0) {
    return res.status(400).json({ error: 'Invalid quantity' });
  }

  if (typeof unit !== 'string' || unit.trim() === '') {
    return res.status(400).json({ error: 'Invalid unit' });
  }

  if (typeof expiration !== 'string' || expiration.trim() === '') {
    return res.status(400).json({ error: 'Invalid expiration' });
  }
  next();
};
