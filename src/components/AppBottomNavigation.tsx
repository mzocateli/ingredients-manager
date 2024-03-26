import React from 'react';

import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { useNavigate } from 'react-router-dom';

const AppBottomNavigation = ({ activeValue = 0 }) => {
  const [value, setValue] = React.useState(activeValue);
  const navigate = useNavigate();

  const handleIngredientsNavigation = () => {
    navigate('/ingredients');
  };

  const handleRecipesNavigation = () => {
    navigate('/recipes');
  };

  return (
    <BottomNavigation
      showLabels
      value={value}
      onChange={(_event, newValue) => {
        setValue(newValue);
      }}
      sx={{ width: '100%', position: 'absolute', bottom: 0 }}
    >
      <BottomNavigationAction label="Itens" icon={<ListIcon />} onClick={handleIngredientsNavigation} />
      <BottomNavigationAction label="Receitas" icon={<FavoriteIcon />} onClick={handleRecipesNavigation} />
      <BottomNavigationAction label="Alarmes" icon={<NotificationsActiveIcon />} />
    </BottomNavigation>
  );
};

export default AppBottomNavigation;
