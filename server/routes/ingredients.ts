import express, { Request, Response } from 'express';
import { readData, writeData } from '../data';
import { validateIngredient } from '../middlewares/validateIngredient';
import { validateItem } from '../middlewares/validateItem';
import { Ingredient, Item } from '../../src/types';

const router = express.Router();

function generateItemId() {
  const part1 = Math.random().toString(36).substr(2, 3);
  const part2 = Math.random().toString(36).substr(2, 3);
  const part3 = Math.random().toString(36).substr(2, 4);

  return `${part1}-${part2}-${part3}`;
}

function processItems(req: any) {
  if (req.body.items) {
    req.body.items = req.body.items.map((item: any) => {
      if (!item.id) item.id = generateItemId();
      return item;
    });
  } else {
    req.body.items = [];
  }
}

router.get('/', (req: Request, res: Response) => {
  const data = readData();
  res.json(data.ingredients);
});

router.post('/', validateIngredient, (req: Request, res: Response) => {
  const data = readData();
  req.body.id = Math.floor(Math.random() * 1000000);
  processItems(req);
  data.ingredients.push(req.body);
  writeData(data);
  res.json(req.body);
});

router.put('/:id', validateIngredient, (req: Request, res: Response) => {
  const data = readData();
  const index = data.ingredients.findIndex(ingredient => ingredient.id === Number(req.params.id));

  if (index === -1) {
    res.status(404).json({ error: 'Ingredient not found' });
  }
  processItems(req);
  data.ingredients[index] = req.body;
  writeData(data);
  res.json(req.body);
});

router.delete('/:id', (req: Request, res: Response) => {
  const data = readData();
  const index = data.ingredients.findIndex(ingredient => ingredient.id === Number(req.params.id));

  if (index === -1) {
    res.status(404).json({ error: 'Ingredient not found' });
  }

  data.ingredients.splice(index, 1);
  writeData(data);
  res.json({ id: Number(req.params.id) });
});

router.get('/:id', (req: Request, res: Response) => {
  const data = readData();
  const ingredient = data.ingredients.find(ingredient => ingredient.id === Number(req.params.id));
  res.json(ingredient);
});

router.get('/:id/items', (req: Request, res: Response) => {
  const data = readData();
  const ingredient = data.ingredients.find(ingredient => ingredient.id === Number(req.params.id));
  res.json(ingredient?.items || []);
});

router.post('/:id/items', validateItem, (req: Request, res: Response) => {
  const data = readData();
  const ingredient = data.ingredients.find(ingredient => ingredient.id === Number(req.params.id));

  if (!ingredient) {
    res.status(404).json({ error: 'Ingredient not found' });
  }

  if (!ingredient?.items) {
    ingredient!.items = [];
  }

  const item = {
    id: generateItemId(),
    ...req.body
  };

  ingredient!.items.push(item);
  writeData(data);
  res.json(item);
});

router.put('/items/use', (req: Request, res: Response) => {
  const data = readData();
  const items: Item[] = req.body.items;
  const updatedItems: Ingredient[] = data.ingredients.map(ingredient => {
    const updatedIngredientItems = ingredient.items.map(item => {
      const matchingItem = items.find((i: Item) => i.id === item.id);
      if (matchingItem) {
        return { ...item, quantity: item.quantity - matchingItem.quantity };
      }
      return item;
    });
    return { ...ingredient, items: updatedIngredientItems };
  });
  writeData({
    ...data,
    ingredients: updatedItems
  });
  res.json(updatedItems);
});

router.put('/:id/items/:itemId', validateItem, (req: Request, res: Response) => {
  const data = readData();
  const ingredient = data.ingredients.find(ingredient => ingredient.id === Number(req.params.id));

  if (!ingredient) {
    res.status(404).json({ error: 'Ingredient not found' });
  }

  const index = ingredient!.items.findIndex(item => item.id === req.params.itemId);

  if (index === -1) {
    res.status(404).json({ error: 'Item not found' });
  }

  ingredient!.items[index] = {
    id: req.params.itemId,
    ...req.body
  };

  writeData(data);
  res.json(ingredient!.items[index]);
});

router.get('/:id/items/:itemId', (req: Request, res: Response) => {
  const data = readData();
  const ingredient = data.ingredients.find(ingredient => ingredient.id === Number(req.params.id));
  const item = ingredient?.items.find(item => item.id === req.params.itemId);
  res.json(item);
});

router.delete('/:id/items/:itemId', (req: Request, res: Response) => {
  const data = readData();
  const ingredient = data.ingredients.find(ingredient => ingredient.id === Number(req.params.id));

  if (!ingredient) {
    res.status(404).json({ error: 'Ingredient not found' });
  }

  const index = ingredient!.items.findIndex(item => item.id === req.params.itemId);

  if (index === -1) {
    res.status(404).json({ error: 'Item not found' });
  }

  ingredient!.items.splice(index, 1);
  writeData(data);
  res.json({ id: req.params.itemId });
});

export default router;
