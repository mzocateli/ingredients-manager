import React, { useEffect, useState } from 'react';
import IngredientAccordion from '../components/IngredientAccordion';
import { Ingredient } from '../types';
import AddIcon from '@mui/icons-material/Add';
import { Fab } from '@mui/material';
import AppTopBar from '../components/TopBar';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AppBottomNavigation from '../components/AppBottomNavigation';

const IngredientsPage = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isFabClicked, setIsFabClicked] = useState(false);

  const handleFabClick = () => {
    setIsFabClicked(!isFabClicked);
  };

  useEffect(() => {
    fetch('http://localhost:3001/api/ingredients')
      .then((response) => response.json())
      .then((data) => setIngredients(data))
      .catch((error) => console.error('Error:', error));
  }, []);

  const navigate = useNavigate();
  const handleButtonClick = () => {
    console.log('Redirecting to /ingredients/register');
    navigate('/ingredients/register');
  };

  const handleUseClick = () => {
    console.log('Redirecting to /ingredients/use');
    navigate('/ingredients/use');
  };

  const handleBuyClick = () => {
    console.log('Redirecting to /items/register');
    localStorage.setItem('isBuying', 'true');
    navigate('/items/register');
  };

  const handleDeleteIngredient = (id: number) => {
    fetch(`http://localhost:3001/api/ingredients/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setIngredients(ingredients.filter((ingredient) => ingredient.id !== id));
      })
      .catch((error) => console.error('Error:', error));
  };

  const handleDeleteItem = (ingredientId: number, itemId: string) => {
    fetch(`http://localhost:3001/api/ingredients/${ingredientId}/items/${itemId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setIngredients(
          ingredients.map((ingredient) =>
            ingredient.id === ingredientId
              ? { ...ingredient, items: ingredient.items.filter((item) => item.id !== itemId) }
              : ingredient
          )
        );
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <div>
      <AppTopBar text="Cadastrar Ingrediente" handleButtonClick={handleButtonClick} />
      {ingredients.map((ingredient) => (
        <IngredientAccordion
          key={ingredient.id}
          ingredient={ingredient}
          onDeleteIngredient={handleDeleteIngredient}
          onDeleteItem={handleDeleteItem}
        />
      ))}
      <div>
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'absolute', bottom: 75, right: 20 }}
          onClick={handleFabClick}
        >
          <AddIcon />
        </Fab>
        {isFabClicked && (
          <div>
            <Fab
              color="secondary"
              aria-label="edit"
              sx={{ position: 'absolute', bottom: 75, right: 90 }}
              onClick={handleBuyClick}
            >
              <EditIcon />
            </Fab>
            <Fab
              color="secondary"
              aria-label="delete"
              sx={{ position: 'absolute', bottom: 140, right: 20 }}
              onClick={handleUseClick}
            >
              <DeleteIcon />
            </Fab>
          </div>
        )}
      </div>
      <AppBottomNavigation />
    </div>
  );
};

export default IngredientsPage;
