import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';

const AppTopBar = ({ text, handleButtonClick }) => {
  return (
    <AppBar position="static" sx={{ marginBottom: '5px' }}>
      <Toolbar>
        <Button color="inherit" sx={{ flexGrow: 1 }} onClick={handleButtonClick}>
          {text}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default AppTopBar;
