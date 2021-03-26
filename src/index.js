import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import AuthContextProvider from './context/auth-context';

ReactDOM.render(
    <AuthContextProvider>
        <App />
    </AuthContextProvider>, 
    document.getElementById('root')
); //wrap entire app in the AuthContextProvider - able for AuthContext from anywhere in the App
