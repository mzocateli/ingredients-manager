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

function processItems(req: Request) {
  if (req.body.items) {
    req.body.items = req.body.items.map((item: Item) => {
      if (!item.id) item.id = generateItemId();
      return item;
    });
  } else {
    req.body.items = [];
  }
}

router.get('/', async (req: Request, res: Response) => {
  const data = await readData();
  res.json(data.ingredients);
});

router.post('/', validateIngredient, async (req: Request, res: Response) => {
  const data = await readData();
  processItems(req);
  const { name, category, items } = req.body;
  const newIngredient: Ingredient = {
    id: Math.floor(Math.random() * 1000000),
    name,
    category,
    items: items.map((item: Item) => ({
      id: item.id || generateItemId(),
      name: item.name,
      quantity: item.quantity
    }))
  };
  data.ingredients.push(newIngredient);
  writeData(data);
  res.json(newIngredient);
});

router.put('/:id', validateIngredient, async (req: Request, res: Response) => {
  const data = await readData();
  const index = data.ingredients.findIndex(ingredient => ingredient.id === Number(req.params.id));

  if (index === -1) {
    res.status(404).json({ error: 'Ingredient not found' });
  }
  processItems(req);

  const { name, category, items } = req.body;
  const updatedIngredient: Ingredient = {
    id: Number(req.params.id),
    name,
    category,
    items: items.map((item: Item) => ({
      id: item.id || generateItemId(),
      name: item.name,
      quantity: item.quantity
    }))
  };
  data.ingredients[index] = updatedIngredient;
  writeData(data);
  res.json(updatedIngredient);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const data = await readData();
  const index = data.ingredients.findIndex(ingredient => ingredient.id === Number(req.params.id));

  if (index === -1) {
    res.status(404).json({ error: 'Ingredient not found' });
  }

  data.ingredients.splice(index, 1);
  writeData(data);
  res.json({ id: Number(req.params.id) });
});

router.get('/:id', async (req: Request, res: Response) => {
  const data = await readData();
  const ingredient = data.ingredients.find(ingredient => ingredient.id === Number(req.params.id));
  res.json(ingredient);
});

router.get('/:id/items', async (req: Request, res: Response) => {
  const data = await readData();
  const ingredient = data.ingredients.find(ingredient => ingredient.id === Number(req.params.id));
  res.json(ingredient?.items || []);
});

router.post('/:id/items', validateItem, async (req: Request, res: Response) => {
  const data = await readData();
  const ingredient = data.ingredients.find(ingredient => ingredient.id === Number(req.params.id));

  if (!ingredient) {
    res.status(404).json({ error: 'Ingredient not found' });
  }

  if (!ingredient?.items) {
    ingredient!.items = [];
  }

  const { name, unit, quantity, expiration } = req.body;
  const item: Item = {
    id: generateItemId(),
    name,
    unit,
    quantity,
    expiration
  };

  ingredient!.items.push(item);
  writeData(data);
  res.json(item);
});

router.put('/items/use', async (req: Request, res: Response) => {
  const data = await readData();
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

router.put('/:id/items/:itemId', validateItem, async (req: Request, res: Response) => {
  const data = await readData();
  const ingredient = data.ingredients.find(ingredient => ingredient.id === Number(req.params.id));

  if (!ingredient) {
    res.status(404).json({ error: 'Ingredient not found' });
  }

  const index = ingredient!.items.findIndex(item => item.id === req.params.itemId);

  if (index === -1) {
    res.status(404).json({ error: 'Item not found' });
  }

  const { name, unit, quantity, expiration } = req.body;
  const updatedItem: Item = {
    id: req.params.itemId,
    name,
    unit,
    quantity,
    expiration
  };

  ingredient!.items[index] = updatedItem;

  writeData(data);
  res.json(updatedItem);
});

router.get('/:id/items/:itemId', async (req: Request, res: Response) => {
  const data = await readData();
  const ingredient = data.ingredients.find(ingredient => ingredient.id === Number(req.params.id));
  const item = ingredient?.items.find(item => item.id === req.params.itemId);
  res.json(item);
});

router.delete('/:id/items/:itemId', async (req: Request, res: Response) => {
  const data = await readData();
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
