import React, { useState, useEffect, useCallback }  from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import axios from 'axios';

function Ingredients() {
  const [ ingredients, setIngredients] = useState([]); 
  const [isLoading, setIsLoading ] = useState(false);
  const [error, setError] = useState();

  // useEffect(() => {
  //   // fetch('https://react-hooks-practice-62927-default-rtdb.firebaseio.com/ingredients.json').then(
  //   //   response =>response.json()).then(
  //   //   responseData => {
  //   //     const loadedIngredients = [];
  //   //     console.log(responseData)

  //   //     for (const key in responseData ){
  //   //       loadedIngredients.push({
  //   //         id: key, 
  //   //         title: responseData[key].title, 
  //   //         amount: responseData[key].amount
  //   //       });
  //   //     }
  //   //     setIngredients(loadedIngredients);
  //   //      console.log(loadedIngredients)
  //   //   });
  //   axios.get('https://react-hooks-practice-62927-default-rtdb.firebaseio.com/ingredients.json').then(
      
  //       responseData => {
  //       const loadedIngredients = [];
  //       console.log(responseData.data)
  //       for (const key in responseData.data){
  //         loadedIngredients.push({
  //           id: key, 
  //           title: responseData.data[key].title, 
  //           amount: responseData.data[key].amount
  //         })
  //       }
  //       setIngredients(loadedIngredients);
  //     console.log(loadedIngredients)
  //     }
  //   )
  // }, []);

  //getting rid of the above useEffect gets rid of an extra render cycle - rendered in the Search.js

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setIngredients(filteredIngredients)
  }, []); //useCallback caches the function so that in re-reder cycvles the funciton is only recreated if a dependecy changes and therefore not passed as a new function (props) to the Search component

  useEffect(() =>{
    console.log("Rendering ingredients", ingredients)
  }, [ingredients]);

  const addIngredientHandler = ingredient => { 
    setIsLoading(true);
    // fetch('https://react-hooks-practice-62927-default-rtdb.firebaseio.com/ingredients.json', {      //posting using browser fetch
    //   method: 'POST', 
    //   body: JSON.stringify({ingredient}), 
    //   headers: { 'Content-Type': 'application/json' }
    // }).then(response => {
    //   return response.json();
    // }).then(responseData => {
    //   setIngredients(prevIngredients => [...prevIngredients, {id: responseData.name, ...ingredient}]);
    // }).catch(error => {
    //  setError("Something went wrong" + " " + error.message)
    //});
    axios.post('https://react-hooks-practice-62927-default-rtdb.firebaseio.com/ingredients.json', ingredient)    //using axios
      .then(responseData => {
        setIsLoading(false);
        setIngredients(prevIngredients => [...prevIngredients, {id: responseData.name, ...ingredient}]);
      }).catch(error => {
        setError("Something went wrong" + " " + error.message)
      })
  };

  const removeIngredientHandler = ingredientID => {
    setIsLoading(true);
    // fetch(`https://react-hooks-practice-62927-default-rtdb.firebaseio.com/ingredients/${ingredientID}.json`, {      //deleting using browser fetch
    //   method: 'DELETE'
    // }).then(response => {
    //  setIsLoading(false);  
    //   setIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== ingredientID))
    // }).catch(error => {
    //  setError("Something went wrong" + " " + error.message)
    //})

    axios.delete(`https://react-hooks-practice-62927-default-rtdb.firebaseio.com/ingredients/${ingredientID}.jon`) //delete using axios
    .then(() => {
      setIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== ingredientID));
      setIsLoading(false);
    }).catch(error => {
      setError("Something went wrong" + " " + error.message)
    })
  }

  const clearError = () => { //batching - state updates in same SYNCHRONOUS block are batched together as to not cause multiple renders 
                            //- cannot use new state immediately after setting - only available to use AFTER next render cycle
    setError(null);
    setIsLoading(false);
  }

  return (
    <div className="App">
    {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>} 
      <IngredientForm onAddIngredient={addIngredientHandler} isLoading={isLoading}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
