import React, { FormEvent, useEffect, useState } from 'react';
import { Button, TextField, Grid, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ItemForm from './ItemForm';
import AppTopBar from './TopBar';
import { Item } from '../types';

const IngredientForm = () => {
  const [id, setId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [items, setItems] = useState<Item[]>([]);
  const [item, setItem] = useState<Item>({ name: '', quantity: 0, unit: '', expiration: '' });
  const [showItemForm, setShowItemForm] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const selectedIngredient = localStorage.getItem('selected_ingredient');
    if (selectedIngredient) {
      const ingredient: { id: string; name: string; category: string; items: Item[] } = JSON.parse(selectedIngredient);
      setId(ingredient.id);
      setName(ingredient.name);
      setCategory(ingredient.category);
      setItems(ingredient.items);
      setIsUpdate(true);
    }
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const ingredient = {
      id,
      name,
      category,
      items,
    };
    try {
      const url = isUpdate ? `http://localhost:3001/api/ingredients/${id}` : 'http://localhost:3001/api/ingredients';
      const response = await fetch(url, {
        method: isUpdate ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ingredient),
      });

      if (!response.ok) {
        console.log(response);
        console.log(await response.json());
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      returnToIngredients();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleConfirmItem = () => {
    setItems([...items, item]);
    setItem({ name: '', quantity: 0, unit: '', expiration: '' });
    setShowItemForm(false);
  };

  const handleItemChange = (field: string, value: string) => {
    setItem({ ...item, [field]: value });
  };

  const handleEditItem = (index: number) => {
    setItem(items[index]);
    setShowItemForm(true);
    setEditingItemIndex(index);
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleCancelItem = () => {
    if (editingItemIndex !== null) {
      const newItems = [...items];
      newItems.splice(editingItemIndex, 0, item);
      setItems(newItems);
      setEditingItemIndex(null);
    }
    setItem({ name: '', quantity: 0, unit: '', expiration: '' });
    setShowItemForm(false);
  };

  const handleDeleteItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const returnToIngredients = () => {
    localStorage.removeItem('selected_ingredient');
    navigate(-1);
  };

  return (
    <>
      <AppTopBar text="Voltar" handleButtonClick={returnToIngredients} />
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
          </Grid>
          {showItemForm && (
            <>
              <ItemForm item={item} handleItemChange={handleItemChange} />
              <Button variant="contained" color="primary" onClick={handleConfirmItem}>
                Confirm
              </Button>
              <Button variant="contained" color="secondary" onClick={handleCancelItem}>
                Cancel
              </Button>
            </>
          )}
          {!showItemForm && (
            <>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={() => setShowItemForm(true)}>
                  Add Item
                </Button>
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <List style={{ maxHeight: '200px', overflow: 'auto' }}>
              {items.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={item.name}
                    secondary={`Quantity: ${item.quantity} ${item.unit}, Expiration: ${item.expiration}`}
                  />
                  <IconButton onClick={() => handleEditItem(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteItem(index)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default IngredientForm;
