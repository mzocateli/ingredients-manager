import { Request, Response, NextFunction } from 'express';
import { Ingredient } from '../../src/types';

export const validateIngredient = (req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line prefer-const
  let { name, category, items }: Ingredient = req.body;

  category = Number(category);

  if (!name || !category) {
    return res.status(400).json({ error: 'Name and category are required' });
  }

  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Invalid name' });
  }

  if (typeof category !== 'number' || !Number.isInteger(category) || category < 0) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  if (items && !Array.isArray(items)) {
    return res.status(400).json({ error: 'Invalid items' });
  }

  if (items) {
    for (const item of items) {
      item.quantity = Number(item.quantity);
      if (!item.name || !item.quantity || !item.unit || !item.expiration) {
        return res.status(400).json({ error: 'Invalid item' });
      }

      if (typeof item.name !== 'string' || item.name.trim() === '') {
        return res.status(400).json({ error: 'Invalid item name' });
      }

      if (typeof item.quantity !== 'number' || item.quantity <= 0) {
        return res.status(400).json({ error: 'Invalid item quantity' });
      }

      if (typeof item.unit !== 'string' || item.unit.trim() === '') {
        return res.status(400).json({ error: 'Invalid item unit' });
      }

      if (typeof item.expiration !== 'string' || item.expiration.trim() === '') {
        return res.status(400).json({ error: 'Invalid item expiration' });
      }
    }
  }

  next();
};
