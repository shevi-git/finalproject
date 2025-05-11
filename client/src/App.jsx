import React from 'react';
import { Provider } from 'react-redux';
import { store } from './Store/store';
import AppRoutes from './AppRoutes';

function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
}

export default App;
