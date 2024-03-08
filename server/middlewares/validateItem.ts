import { Request, Response, NextFunction } from 'express';
import { Item } from '../types';

export const validateItem = (req: Request, res: Response, next: NextFunction) => {
  const { name, quantity, unit, expiration }: Item = req.body;
  if (!name || !quantity || !unit || !expiration) {
    return res.status(400).json({ error: 'Name, quantity, unit, and expiration are required' });
  }

  if (typeof name !== 'string' || name.trim() === '') {
    res.status(400).json({ error: 'Invalid name' });
  }

  if (typeof quantity !== 'number' || quantity <= 0) {
    res.status(400).json({ error: 'Invalid quantity' });
  }

  if (typeof unit !== 'string' || unit.trim() === '') {
    res.status(400).json({ error: 'Invalid unit' });
  }

  if (typeof expiration !== 'string' || expiration.trim() === '') {
    res.status(400).json({ error: 'Invalid expiration' });
  }
  next();
};
