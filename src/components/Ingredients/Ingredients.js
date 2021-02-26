import React, { useState, useEffect }  from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import axios from 'axios';

function Ingredients() {
  const [ ingredients, setIngredients] = useState([]); 

  useEffect(() => {
    // fetch('https://react-hooks-practice-62927-default-rtdb.firebaseio.com/ingredients.json').then(
    //   response =>response.json()).then(
    //   responseData => {
    //     const loadedIngredients = [];
    //     console.log(responseData)

    //     for (const key in responseData ){
    //       loadedIngredients.push({
    //         id: key, 
    //         title: responseData[key].title, 
    //         amount: responseData[key].amount
    //       });
    //     }
    //     setIngredients(loadedIngredients);
    //      console.log(loadedIngredients)
    //   });
    axios.get('https://react-hooks-practice-62927-default-rtdb.firebaseio.com/ingredients.json').then(
      
        responseData => {
        const loadedIngredients = [];
        console.log(responseData.data)
        for (const key in responseData.data){
          loadedIngredients.push({
            id: key, 
            title: responseData.data[key].title, 
            amount: responseData.data[key].amount
          })
        }
        setIngredients(loadedIngredients);
      console.log(loadedIngredients)
      }
    )
  }, []);

  

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
