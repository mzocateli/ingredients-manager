import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionSummary, Typography, AccordionDetails, List, ListItem } from '@mui/material';
import React from 'react';
import { Ingredient, Item } from '../types';
import { useNavigate } from 'react-router-dom';

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onEdit, onDelete }) => (
  <>
    <IconButton aria-label="edit" onClick={onEdit}>
      <EditIcon />
    </IconButton>
    <IconButton aria-label="delete" onClick={onDelete}>
      <DeleteIcon />
    </IconButton>
  </>
);

const IngredientAccordion = ({ ingredient }: { ingredient: Ingredient }) => {
  const navigate = useNavigate();
  const handleEditIngredient = () => {
    console.log('Edit ingredient', ingredient);
    localStorage.setItem('selected_ingredient', JSON.stringify(ingredient));
    navigate('/ingredients/register');
  };

  const handleDeleteIngredient = () => {
    console.log('Delete ingredient', ingredient);
    // Add your delete ingredient logic here
  };

  const handleEditItem = (item: Item, ingredientId) => {
    console.log('Edit item', item, ingredientId);
    localStorage.setItem('selected_item', JSON.stringify({ ...item, ingredientId }));
    navigate('/items/register');
  };

  const handleDeleteItem = (item) => {
    console.log('Delete item', item);
    // Add your delete item logic here
  };

  return (
    <Accordion key={ingredient.id}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{ingredient.name}</Typography>
        <ActionButtons onEdit={handleEditIngredient} onDelete={handleDeleteIngredient} />
      </AccordionSummary>
      <AccordionDetails>
        <List>
          {ingredient.items.map((item) => (
            <ListItem key={item.id}>
              {item.name} - {item.quantity}
              {item.unit}
              <ActionButtons
                onEdit={() => handleEditItem(item, ingredient.id)}
                onDelete={() => handleDeleteItem(item)}
              />
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

export default IngredientAccordion;
