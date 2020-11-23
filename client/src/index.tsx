import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import * as serviceWorker from './serviceWorker';
import './index.css';
import App from './App';
import { store } from 'store/store';

const app = (
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);

ReactDOM.render(app, document.getElementById('root'));

serviceWorker.unregister();
