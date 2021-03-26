import React, { useContext } from 'react';

import Ingredients from './components/Ingredients/Ingredients';
import Auth from './components/Auth';
import { AuthContext } from './context/auth-context'

const App = props => {
  const authContext = useContext(AuthContext); //set variable for useContext takes argument of the AuthContext object that is imported from auth-context


  let content = <Auth />
  if (authContext.isAuth) { //isAuthenticated state from AuthContextProvider in auth-content
    content = <Ingredients /> //if authenticated Ingreditents is shown, if not, the authentication card in Auth.js is shown
  }

  return content;
};

export default App;
