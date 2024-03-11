import React from 'react';
import { TextField, Grid, Select, MenuItem } from '@mui/material';

interface ItemFormProps {
  item: any;
  handleItemChange: (field: string, value: string) => void;
  ingredientId?: string;
}

const ItemForm: React.FC<ItemFormProps> = ({ item, handleItemChange }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField label="Name" value={item.name} onChange={(e) => handleItemChange('name', e.target.value)} required />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Quantity"
          type="number"
          value={item.quantity}
          onChange={(e) => handleItemChange('quantity', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <Select label="Unit" value={item.unit} onChange={(e) => handleItemChange('unit', e.target.value)} required>
          <MenuItem value="g">g</MenuItem>
          <MenuItem value="kg">kg</MenuItem>
          <MenuItem value="ml">ml</MenuItem>
          <MenuItem value="l">l</MenuItem>
          <MenuItem value="un">un</MenuItem>
        </Select>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Expiration"
          type="date"
          value={item.expiration}
          onChange={(e) => handleItemChange('expiration', e.target.value)}
          required
        />
      </Grid>
    </Grid>
  );
};

export default ItemForm;
