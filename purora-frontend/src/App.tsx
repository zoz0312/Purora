import React from 'react';
import './style/tailwind.css'
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Routers from "@routers/index";

function App() {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <Routers />
      </HelmetProvider>
    </BrowserRouter>
  );
}

export default App;
