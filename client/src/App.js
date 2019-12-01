import React from 'react';
import { StoreProvider } from 'easy-peasy';

import store from './store';
import Images from './Images';

function App() {
  return (
    <StoreProvider store={store}>
      <Images />
    </StoreProvider>
  );
}

export default App;
