import React from 'react';

import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const AppBottomNavigation = () => {
  const [value, setValue] = React.useState(0);

  return (
    <BottomNavigation
      showLabels
      value={value}
      onChange={(_event, newValue) => {
        setValue(newValue);
      }}
      sx={{ width: '100%', position: 'absolute', bottom: 0 }}
    >
      <BottomNavigationAction label="Itens" icon={<ListIcon />} />
      <BottomNavigationAction label="Receitas" icon={<FavoriteIcon />} />
      <BottomNavigationAction label="Alarmes" icon={<NotificationsActiveIcon />} />
    </BottomNavigation>
  );
};

export default AppBottomNavigation;
