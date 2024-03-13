import React from 'react';
import AppTopBar from '../components/TopBar';
import { useNavigate } from 'react-router-dom';
import IngredientUseForm from '../components/IngredientUseForm';

const UsePage = () => {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate(-1);
  };
  return (
    <>
      <AppTopBar text="Voltar" handleButtonClick={handleButtonClick} />
      <IngredientUseForm />
    </>
  );
};

export default UsePage;
