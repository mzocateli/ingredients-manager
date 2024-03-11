import React, { FormEvent, useState, useEffect } from 'react';
import AppTopBar from '../components/TopBar';
import { useNavigate } from 'react-router-dom';
import { Item } from '../types';
import ItemForm from '../components/ItemForm';
import { Button } from '@mui/material';

const ItemsPage = () => {
  const [item, setItem] = useState<Item>({ name: '', quantity: 0, unit: '', expiration: '' });
  const [ingredientId, setIngredientId] = useState<number>(0);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const selectedItem = localStorage.getItem('selected_item');
    if (selectedItem) {
      const localItem = JSON.parse(selectedItem);
      setItem(localItem);
      setIngredientId(localItem.ingredientId);
      setIsEdit(true);
    }
  }, []);

  const returnToIngredients = () => {
    localStorage.removeItem('selected_item');
    navigate(-1);
  };

  const handleButtonClick = () => {
    console.log('Redirecting to /ingredients');
    returnToIngredients();
  };

  const handleItemChange = (field: string, value: string) => {
    setItem({ ...item, [field]: value });
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const url = isEdit
      ? `http://localhost:3001/api/ingredients/${ingredientId}/items/${item.id}`
      : `http://localhost:3001/api/ingredients/${ingredientId}/items`;
    const method = isEdit ? 'PUT' : 'POST';
    const body = JSON.stringify(item);
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
        <ItemForm item={item} handleItemChange={handleItemChange} />
        <Button type="submit" variant="contained" color="primary">
          Salvar
        </Button>
      </form>
    </div>
  );
};

export default ItemsPage;
