import React from 'react';
import store from './store';
import {Provider} from 'react-redux';
import App from './App';

// warping the App.js with the redux and then importing this in index.js
const RootApp = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default RootApp;
