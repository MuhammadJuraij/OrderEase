import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './Componenets/Home';
import AddOrder from './Componenets/AddOrder';
import ViewOrder from './Componenets/ViewOrder';


const App = () => {
  // Check if "excelData" exists in local storage and is not empty
  const isExcelDataPresent = localStorage.getItem('excelData') !== null && localStorage.getItem('excelData') !== '';

  return (
    <>
      <Routes>
        {/* Redirect to Home if excelData is in local storage, otherwise FileUpload */}
        <Route path="/" element={<Home />} />
        <Route path="/addorder" element={<AddOrder />} />
        <Route path="/vieworder" element={<ViewOrder />} />
        {/* Redirect any unknown path to "/" */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
