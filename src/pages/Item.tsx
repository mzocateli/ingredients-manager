import React, { FormEvent, useState, useEffect } from 'react';
import AppTopBar from '../components/TopBar';
import { useNavigate } from 'react-router-dom';
import { Ingredient, Item } from '../types';
import ItemForm from '../components/ItemForm';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const ItemsPage = () => {
  const [item, setItem] = useState<Item>({ name: '', quantity: 0, unit: '', expiration: '' });
  const [ingredientId, setIngredientId] = useState<number | ''>('');
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const selectedItem = localStorage.getItem('selected_item');
    if (selectedItem) {
      const localItem = JSON.parse(selectedItem);
      setItem(localItem);
      setIngredientId(localItem.ingredientId);
      setIsEdit(true);
    }

    if (localStorage.getItem('isBuying') === 'true') {
      fetch('http://localhost:3001/api/ingredients')
        .then((response) => response.json())
        .then((data) => setIngredients(data));
    }
  }, []);

  const returnToIngredients = () => {
    localStorage.removeItem('selected_item');
    localStorage.removeItem('isBuying');
    navigate(-1);
  };

  const handleButtonClick = () => {
    console.log('Redirecting to /ingredients');
    returnToIngredients();
  };

  const handleItemChange = (field: string, value: string) => {
    setItem({ ...item, [field]: value });
  };

  const handleIngredientChange = (event) => {
    setIngredientId(event.target.value === '' ? '' : Number(event.target.value));
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const url = isEdit
      ? `http://localhost:3001/api/ingredients/${ingredientId}/items/${item.id}`
      : `http://localhost:3001/api/ingredients/${ingredientId}/items`;
    const method = isEdit ? 'PUT' : 'POST';
    const body = JSON.stringify({ ...item, ingredientId });
    const headers = {
      'Content-Type': 'application/json',
    };

    fetch(url, {
      method,
      headers,
      body,
    })
      .then((response) => {
        if (!response.ok) {
          console.log(response);
          console.log(response.json());
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);
        returnToIngredients();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  return (
    <div>
      <AppTopBar text="Voltar" handleButtonClick={handleButtonClick} />
      <form onSubmit={handleSubmit}>
        {localStorage.getItem('isBuying') === 'true' && (
          <FormControl style={{ minWidth: '300px' }}>
            <InputLabel id="ingredient-label">Ingredient</InputLabel>
            <Select labelId="ingredient-label" value={ingredientId} onChange={handleIngredientChange}>
              {ingredients.map((ingredient) => (
                <MenuItem key={ingredient.id} value={ingredient.id}>
                  {ingredient.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <ItemForm item={item} handleItemChange={handleItemChange} />
        <Button type="submit" variant="contained" color="primary">
          Salvar
        </Button>
      </form>
    </div>
  );
};

export default ItemsPage;
