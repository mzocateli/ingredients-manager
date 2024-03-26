import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, IconButton, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { ApiRecipe } from '../types';

interface RecipeListProps {
  recipes: ApiRecipe[];
  savedRecipes?: ApiRecipe[];
  onUnfavorite?: (recipeId: string) => void;
  onFavorite?: (recipe: ApiRecipe) => void;
}

const ApiRecipeList = ({ recipes, savedRecipes: initialSavedRecipes, onUnfavorite, onFavorite }: RecipeListProps) => {
  const [savedRecipes, setSavedRecipes] = useState<string[]>([]);
  const [isRequesting, setRequesting] = useState(false);

  useEffect(() => {
    setSavedRecipes(initialSavedRecipes?.map((recipe) => recipe.id) || []);
  }, [initialSavedRecipes]);

  const handleFavoriteToggle = async (recipe: ApiRecipe) => {
    if (isRequesting) {
      return;
    }
    const isFavorited = savedRecipes.includes(recipe.id);
    let newSavedRecipes;

    if (isFavorited) {
      newSavedRecipes = savedRecipes.filter((id) => id !== recipe.id);
      setSavedRecipes(newSavedRecipes);
    } else {
      newSavedRecipes = [...savedRecipes, recipe.id];
      setSavedRecipes(newSavedRecipes);
    }

    try {
      if (isFavorited) {
        setRequesting(true);
        await fetch(`http://localhost:3001/api/recipes/${recipe.id}`, {
          method: 'DELETE',
        });
        if (onUnfavorite) {
          onUnfavorite(recipe.id);
        }
      } else {
        setRequesting(true);
        await fetch('http://localhost:3001/api/recipes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: recipe.id,
            name: recipe.name,
            url: recipe.url,
            saved_on: new Date().toISOString(),
          }),
        });
        if (onFavorite) {
          onFavorite(recipe);
        }
      }
    } catch (error) {
      console.error('Failed to update recipe', error);
      setSavedRecipes(isFavorited ? [...savedRecipes, recipe.id] : savedRecipes.filter((id) => id !== recipe.id));
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div>
      {recipes.map((recipe) => (
        <Card key={recipe.id} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body1" component="div" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                {recipe.name}
              </Typography>
              <IconButton onClick={() => handleFavoriteToggle(recipe)}>
                {savedRecipes.includes(recipe.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Box>
            <Button variant="contained" href={recipe.url || '#'} target="_blank" rel="noreferrer" size="small">
              Acessar
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ApiRecipeList;
