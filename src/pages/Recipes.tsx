import React, { useState, useEffect } from 'react';
import AppTopBar from '../components/TopBar';
import AppBottomNavigation from '../components/AppBottomNavigation';
import SearchRecipesForm from '../components/SearchRecipes';
import { ApiRecipe } from '../types';
import ApiRecipeList from '../components/ApiRecipeList';
import { Box } from '@mui/material';

const RecipesPage = () => {
  const [showSearchRecipesForm, setShowSearchRecipesForm] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState<ApiRecipe[]>([]);

  useEffect(() => {
    if (!showSearchRecipesForm) {
      const fetchSavedRecipes = async () => {
        try {
          const response = await fetch('http://localhost:3001/api/recipes');
          const data = await response.json();
          setSavedRecipes(data);
        } catch (error) {
          console.error('Failed to fetch saved recipes', error);
        }
      };

      fetchSavedRecipes();
    }
  }, [showSearchRecipesForm]);

  const handleButtonClick = () => {
    setShowSearchRecipesForm(!showSearchRecipesForm);
  };

  const handleUnfavorite = (recipeId: string) => {
    setSavedRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== recipeId));
  };

  const handleFavorite = (recipe: ApiRecipe) => {
    setSavedRecipes((prevRecipes) => [...prevRecipes, recipe]);
  };

  return (
    <>
      <AppTopBar
        text={showSearchRecipesForm ? 'Voltar' : 'Consultar Novas Receitas'}
        handleButtonClick={handleButtonClick}
      />
      {showSearchRecipesForm ? (
        <SearchRecipesForm savedRecipes={savedRecipes.map((recipe) => ({ ...recipe, id: recipe.id || '' }))} />
      ) : (
        <Box maxWidth="100%" maxHeight={'calc(100% - 112px)'} overflow="auto">
          <ApiRecipeList
            recipes={savedRecipes}
            savedRecipes={savedRecipes}
            onUnfavorite={handleUnfavorite}
            onFavorite={handleFavorite}
          />
        </Box>
      )}
      <AppBottomNavigation activeValue={1} />
    </>
  );
};

export default RecipesPage;
