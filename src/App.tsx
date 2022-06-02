import React from 'react';

import Banner from './components/Banner';
import './App.css';

function App() {
  return (
    <div className="App">
      <Banner title="Header" />
      <Banner title="Header" placement="bottom" />
    </div>
  );
}

export default App;
