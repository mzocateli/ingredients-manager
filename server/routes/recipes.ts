import express, { Request, Response } from 'express';
import recipesMock from '../../mockrecipes.json';
import { readData, writeData } from '../data';


async function translateIngredients(ingredients: string) {
  const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${process.env.VITE_TRANSLATE_API_KEY}&q=${ingredients}&source=pt-br&target=en`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  return data.data.translations[0].translatedText;
}

async function getRecipeQuery(translatedText: string) {
  const authorization = Buffer.from(`${process.env.VITE_APP_ID}:${process.env.VITE_APP_KEY}`).toString('base64');
  const response = await fetch('https://api.edamam.com/api/assistant/v1/query', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authorization}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "options": {
        "calls": [
          "search"
        ]
      },
      "exchange": [
        {
          "query": `recipes using the ingredients: ${translatedText}`
        }
      ]
    })
  });

  const data = await response.json();
  return data.request.uri;
}

async function getRecipes(query: string) {
  const response = await fetch(`https://api.edamam.com${query}&type=public&app_id=${process.env.VITE_APP_ID}&app_key=${process.env.VITE_APP_KEY}&field=label&field=url`, {
    method: 'GET',
  });
  const data = await response.json();

  const formattedData = data.hits.map((hit: { recipe: { label: string; url: string; }; _links: { self: { href: string; }; }; }) => ({
    name: hit.recipe.label,
    url: hit.recipe.url,
    id: hit._links.self.href.split('v2/')[1].split('?')[0]
  }));

  return formattedData;
}


const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const data = await readData();
  res.json(data.recipes);
});

router.get('/:id', async (req: Request, res: Response) => {
  const data = await readData();
  const recipe = data.recipes.find((recipe) => recipe.id === req.params.id);
  res.json(recipe);
});

router.post('/by-ingredients', async (req: Request, res: Response) => {
  try {
    // const ingredients = req.body.ingredients.join(',');
    // const translatedText = await translateIngredients(ingredients);
    // const recipeQuery = await getRecipeQuery(translatedText);
    // const recipes = await getRecipes(recipeQuery);
    // const translatedText = 'White rice, Trout';
    // const recipeQuery = "/api/recipes/v2?q=White+rice%2C+Trout";
    const recipes = recipesMock;
    res.json(recipes);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const data = await readData();
  const newRecipe = req.body;
  data.recipes.push(newRecipe);
  writeData(data);
  res.json(newRecipe);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const data = await readData();
  const recipeIndex = data.recipes.findIndex((recipe) => recipe.id === req.params.id);
  if (recipeIndex >= 0) {
    data.recipes.splice(recipeIndex, 1);
    writeData(data);
  }
  res.json({ message: 'Recipe deleted successfully' });
});

export default router;
