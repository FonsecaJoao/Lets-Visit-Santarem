import React from 'react';
import ReactDOM from 'react-dom';
import './styles/App.css';
import App from './components/app.js';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
