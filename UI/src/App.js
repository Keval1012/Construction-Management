import React from 'react';
import './App.css';
import AuthProvider from './context/AuthProvider';
import Layouts from './Layouts';

const App = () => {

  return (
    <AuthProvider>
      <Layouts />
    </AuthProvider>
  );
}

export default App;