import React, { useState, useEffect } from 'react';
import { Checkbox, FormControlLabel, Button, Box } from '@mui/material';
import { ApiRecipe, Ingredient } from '../types';
import ApiRecipeList from './ApiRecipeList';

const SearchRecipesForm = ({ savedRecipes }: { savedRecipes?: ApiRecipe[] }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<{ [key: string]: boolean }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<ApiRecipe[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/ingredients')
      .then((response) => response.json())
      .then((data) => setIngredients(data));
  }, []);

  const handleCheckboxChange = (ingredientId: string, isChecked: boolean) => {
    setSelectedIngredients((prev) => ({
      ...prev,
      [ingredientId]: isChecked,
    }));
  };

  const handleSubmit = () => {
    const listOfIngredients = Object.keys(selectedIngredients)
      .filter((key) => selectedIngredients[key])
      .map((id) => {
        const ingredient = ingredients.find((ingredient) => ingredient.id === Number(id));
        return ingredient ? ingredient.name : '';
      });
    console.log(listOfIngredients);
    fetch('http://localhost:3001/api/recipes/by-ingredients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ingredients: listOfIngredients,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setResult(data);
        setIsSubmitted(true);
      });
  };

  return (
    <>
      <h2>Receitas Incluindo:</h2>
      {!isSubmitted ? (
        <Box maxWidth="100%" maxHeight="100%">
          {ingredients.map((ingredient) => (
            <div key={ingredient.id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedIngredients[String(ingredient.id)] || false}
                    onChange={(e) => handleCheckboxChange(String(ingredient.id), e.target.checked)}
                  />
                }
                label={ingredient.name}
              />
            </div>
          ))}
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Enviar
          </Button>
        </Box>
      ) : (
        <Box maxWidth="100%" maxHeight={'calc(100% - 112px)'} overflow="auto">
          <ApiRecipeList recipes={result} savedRecipes={savedRecipes} />
        </Box>
      )}
    </>
  );
};

export default SearchRecipesForm;
