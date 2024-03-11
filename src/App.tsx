import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import AppBottomNavigation from './components/AppBottomNavigation';
import IngredientsPage from './pages/Ingredients';
import IngredientForm from './components/IngredientForm';
import ItemsPage from './pages/Item';

const DefaultRouteRedirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/ingredients');
  }, [navigate]);

  return null;
};

const App = () => {
  return (
    <Box sx={{ width: 360, height: 740, position: 'relative', paddingBottom: '56px' }}>
      <Router>
        <Routes>
          <Route path="/" element={<DefaultRouteRedirect />} />
          <Route path="/ingredients" element={<IngredientsPage />} />
          <Route path="/ingredients/register" element={<IngredientForm />} />
          <Route path="/items/register" element={<ItemsPage />} />
        </Routes>
      </Router>
      <AppBottomNavigation />
    </Box>
  );
};

export default App;
