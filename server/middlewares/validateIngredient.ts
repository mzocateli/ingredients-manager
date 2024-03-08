import { Request, Response, NextFunction } from 'express';
import { Ingredient } from '../types';

export const validateIngredient = (req: Request, res: Response, next: NextFunction) => {
  const { name, category, items }: Ingredient = req.body;

  if (!name || !category) {
    return res.status(400).json({ error: 'Name and category are required' });
  }

  if (typeof name !== 'string' || name.trim() === '') {
    res.status(400).json({ error: 'Invalid name' });
  }

  if (typeof category !== 'number' || !Number.isInteger(category) || category < 0) {
    res.status(400).json({ error: 'Invalid category' });
  }

  if (items && !Array.isArray(items)) {
    res.status(400).json({ error: 'Invalid items' });
  }

  if (items) {
    for (const item of items) {
      if (!item.name || !item.quantity || !item.unit || !item.expiration) {
        res.status(400).json({ error: 'Invalid item' });
      }

      if (typeof item.name !== 'string' || item.name.trim() === '') {
        res.status(400).json({ error: 'Invalid item name' });
      }

      if (typeof item.quantity !== 'number' || item.quantity <= 0) {
        res.status(400).json({ error: 'Invalid item quantity' });
      }

      if (typeof item.unit !== 'string' || item.unit.trim() === '') {
        res.status(400).json({ error: 'Invalid item unit' });
      }

      if (typeof item.expiration !== 'string' || item.expiration.trim() === '') {
        res.status(400).json({ error: 'Invalid item expiration' });
      }
    }
  }

  next();
};
