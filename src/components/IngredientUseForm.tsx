import React, { useState, useEffect } from 'react';
import { Checkbox, FormControlLabel, TextField, Button } from '@mui/material';
import { Ingredient } from '../types';
import { useNavigate } from 'react-router-dom';

const IngredientUseForm = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/api/ingredients')
      .then((response) => response.json())
      .then((data) => setIngredients(data));
  }, []);

  const handleCheckboxChange = (itemId: string, isChecked: boolean) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: isChecked,
    }));
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: quantity,
    }));
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
  };

  const handleCancel = () => {
    setIsConfirmed(false);
  };

  const handleSubmit = () => {
    console.log(quantities);
    fetch('http://localhost:3001/api/ingredients/items/use', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: Object.keys(quantities).map((id) => ({
          id,
          quantity: quantities[id],
        })),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        navigate(-1);
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <div>
      {!isConfirmed ? <h2>Items Utilizados</h2> : <h2>Quantidades Utilizadas</h2>}
      {ingredients.map((ingredient) =>
        ingredient.items.map((item) => (
          <div key={item.id}>
            {!isConfirmed ? (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedItems[String(item.id)] || false}
                    onChange={(e) => handleCheckboxChange(String(item.id), e.target.checked)}
                  />
                }
                label={`${item.name} - ${item.quantity}${item.unit}`}
              />
            ) : selectedItems[String(item.id)] ? (
              <>
                <p>{item.name}</p>
                <TextField
                  label="Quantity"
                  helperText={`Available: ${item.quantity}${item.unit}`}
                  type="number"
                  value={quantities[String(item.id)] || ''}
                  onChange={(e) => handleQuantityChange(String(item.id), Number(e.target.value))}
                />
              </>
            ) : null}
          </div>
        ))
      )}
      {!isConfirmed ? (
        <Button variant="contained" color="primary" onClick={handleConfirm}>
          Confirmar
        </Button>
      ) : (
        <>
          <Button variant="contained" color="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Enviar
          </Button>
        </>
      )}
    </div>
  );
};

export default IngredientUseForm;
