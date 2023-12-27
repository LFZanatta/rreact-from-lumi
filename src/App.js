import React from 'react';
import Dashboard from './components/Dashboard';
import InvoiceLibrary from './components/InvoiceLibrary';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => { 
  return (
    <Router>
       <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/invoice-library" element={<InvoiceLibrary />} />
      </Routes>
    </Router>
  );
};

export default App;
