import React, { useState, useReducer, useEffect, useCallback }  from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import axios from 'axios';

const ingredientReducer = (currentIngredients, action) => { //first arg is the state, second is an action for updating state - outside of component to not cause re-render
  switch (action.type) {
    case "SET":
      return action.ingredients; //array of ingredients replacing old state
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter(ing => ing.id !== action.id)
    default: 
      throw new Error("Shouldnt happen")
  }
}

const httpReducer = (curHttpState, action) => {
  switch (action.type){
    case "SEND":
      return {loading: true, error: null};
    case "Response":
      return { ...curHttpState, loading: false};
    case "Error":
      return { loading: false, error: action.errorMessage};
    case "Clear":
      return {...curHttpState, error: null};
    default:
      throw new Error ("Should not be reached");
  }
}

function Ingredients() {
  const [ingredients, dispatch] = useReducer(ingredientReducer, []) //useReducertakes arguemnst of reducer function and starting state - here empty array being based as currentIngredients
                                                                    //the destructed variables are the state and the funciton to call to dispatch the actions in the reducer function (ingredientReducer)
  // const [ ingredients, setIngredients] = useState([]); 
  const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null});
  // const [isLoading, setIsLoading ] = useState(false);
  // const [error, setError] = useState();

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
    // setIngredients(filteredIngredients) replace with ingredient reducer
    dispatch({type: "SET", ingredients: filteredIngredients});
  }, []); //useCallback caches the function so that in re-reder cycvles the funciton is only recreated if a dependecy changes and therefore not passed as a new function (props) to the Search component

  useEffect(() =>{
    console.log("Rendering ingredients", ingredients)
  }, [ingredients]);

  const addIngredientHandler = ingredient => { 
    // setIsLoading(true); replacing with http reducer
    dispatchHttp({type: "SEND"});
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
        // setIsLoading(false); replace with http reducer
        dispatchHttp({type: "Response"})
        // setIngredients(prevIngredients => [...prevIngredients, {id: responseData.name, ...ingredient}]); replace with ingredient reducer
        dispatch({type: "ADD", ingredient: {id: responseData.name, ...ingredient}})
      }).catch(error => {
        // setError("Something went wrong" + " " + error.message) replace with http reducer
        dispatchHttp({type: "Error", errorMessage: "Something went wrong" + " " + error.message})
      })
  };

  const removeIngredientHandler = ingredientID => {
    // setIsLoading(true); replace with http reducer
    dispatchHttp({type: "SEND"});
    // fetch(`https://react-hooks-practice-62927-default-rtdb.firebaseio.com/ingredients/${ingredientID}.json`, {      //deleting using browser fetch
    //   method: 'DELETE'
    // }).then(response => {
    //  setIsLoading(false);  
    //   setIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== ingredientID))
    // }).catch(error => {
    //  setError("Something went wrong" + " " + error.message)
    //})

    axios.delete(`https://react-hooks-practice-62927-default-rtdb.firebaseio.com/ingredients/${ingredientID}.json`) //delete using axios
    .then(() => {
      // setIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== ingredientID));
      dispatch({type: "DELETE", id: ingredientID});
      // setIsLoading(false); replace with http reducer
      dispatchHttp({type: "Response"})
    }).catch(error => {
      // setError("Something went wrong" + " " + error.message) replace with http reducer
      dispatchHttp({type: "Error", errorMessage: "Something went wrong" + " " + error.message})
    })
  }

  const clearError = () => { //batching - state updates in same SYNCHRONOUS block are batched together as to not cause multiple renders 
                            //- cannot use new state immediately after setting - only available to use AFTER next render cycle
    // setError(null); replace with http reducer
    // setIsLoading(false);
    dispatchHttp({type: "Clear"})
  }

  return (
    <div className="App">
    {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>} 
      <IngredientForm onAddIngredient={addIngredientHandler} isLoading={httpState.loading}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
