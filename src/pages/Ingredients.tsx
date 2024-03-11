import React, { useEffect, useState } from 'react';
import IngredientAccordion from '../components/IngredientAccordion';
import { Ingredient } from '../types';
import AddIcon from '@mui/icons-material/Add';
import { Fab } from '@mui/material';
import AppTopBar from '../components/TopBar';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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

  return (
    <div>
      <AppTopBar text="Cadastrar Ingrediente" handleButtonClick={handleButtonClick} />
      {ingredients.map((ingredient) => (
        <IngredientAccordion key={ingredient.id} ingredient={ingredient} />
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
            <Fab color="secondary" aria-label="edit" sx={{ position: 'absolute', bottom: 75, right: 90 }}>
              <EditIcon />
            </Fab>
            <Fab color="secondary" aria-label="delete" sx={{ position: 'absolute', bottom: 140, right: 20 }}>
              <DeleteIcon />
            </Fab>
          </div>
        )}
      </div>
    </div>
  );
};

export default IngredientsPage;