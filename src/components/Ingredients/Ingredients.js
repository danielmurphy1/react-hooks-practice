import React, { useState}  from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import axios from 'axios';

function Ingredients() {
  const [ ingredients, setIngredients] = useState([]); 

  const addIngredientHandler = ingredient => { 
    // fetch('https://react-hooks-practice-62927-default-rtdb.firebaseio.com/ingredients.json', {      //posting using browser fetch
    //   method: 'POST', 
    //   body: JSON.stringify({ingredient}), 
    //   headers: { 'Content-Type': 'application/json' }
    // }).then(response => {
    //   return response.json();
    // }).then(responseData => {
    //   setIngredients(prevIngredients => [...prevIngredients, {id: responseData.name, ...ingredient}]);
    // });
    axios.post('https://react-hooks-practice-62927-default-rtdb.firebaseio.com/ingredients.json', ingredient)    //using axios
      .then(responseData => {
        setIngredients(prevIngredients => [...prevIngredients, {id: responseData.name, ...ingredient}]);
      })
  };

  const removeIngredientHandler = ingredientID => {
    setIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== ingredientID))
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler}/>

      <section>
        <Search />
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
