import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  List,
  ListItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
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

const IngredientAccordion = ({
  ingredient,
  onDeleteIngredient,
  onDeleteItem,
}: {
  ingredient: Ingredient;
  onDeleteIngredient: (id: number) => void;
  onDeleteItem: (ingredientId: number, itemId: string) => void;
}) => {
  const [open, setOpen] = React.useState(false);
  const [deleteType, setDeleteType] = React.useState<'ingredient' | 'item'>('ingredient');
  const [deleteItem, setDeleteItem] = React.useState<Item | null>(null);
  const navigate = useNavigate();

  const handleOpen = (type: 'ingredient' | 'item', item?: Item) => {
    setDeleteType(type);
    setDeleteItem(item || null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteType === 'ingredient') {
      console.log('Delete ingredient', ingredient);

      if (ingredient.id) {
        onDeleteIngredient(ingredient.id);
      }
    } else if (deleteType === 'item' && deleteItem) {
      console.log('Delete item', deleteItem);
      if (ingredient.id && deleteItem.id) {
        onDeleteItem(ingredient.id, deleteItem.id);
      }
    }
    setOpen(false);
  };

  const handleEditIngredient = () => {
    console.log('Edit ingredient', ingredient);
    localStorage.setItem('selected_ingredient', JSON.stringify(ingredient));
    navigate('/ingredients/register');
  };

  const handleDeleteIngredient = () => {
    handleOpen('ingredient');
  };

  const handleEditItem = (item: Item, ingredientId) => {
    console.log('Edit item', item, ingredientId);
    localStorage.setItem('selected_item', JSON.stringify({ ...item, ingredientId }));
    navigate('/items/register');
  };

  const handleDeleteItem = (item) => {
    handleOpen('item', item);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{`Deletar ${deleteType}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>{`Você tem certeza que deseja deletar ${deleteType}?`}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
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
    </>
  );
};

export default IngredientAccordion;
