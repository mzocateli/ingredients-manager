import React from 'react';

import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArchiveIcon from '@mui/icons-material/Archive';

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
      <BottomNavigationAction label="Itens" icon={<RestoreIcon />} />
      <BottomNavigationAction label="Receitas" icon={<FavoriteIcon />} />
      <BottomNavigationAction label="Alarmes" icon={<ArchiveIcon />} />
    </BottomNavigation>
  );
};

export default AppBottomNavigation;
