import React, { useState }from 'react';

import Card from '../UI/Card';
import LoadingIndicator from '../UI/LoadingIndicator';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {
 //const [ inputState, setInputState ] = useState({title: "", amount: ""}); //useState returns an array of exactly two elements - 0 is state snapshot, 1 is function for updating state (set state)
                                                                          //destructure the returned array so that the state(data) and set state function are stored seperately
 const [enteredTitle, setEnteredTitle] = useState(''); //instead of having state in an object and having to keep track of each, can have multiple states for each and only track each as needed
 const [enteredAmount, setEnteredAmount] = useState('');

  const submitHandler = event => {
    event.preventDefault();
    props.onAddIngredient({title: enteredTitle, amount: enteredAmount});
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input 
              type="text" 
              id="title" 
              //value={inputState.title}
              value={enteredTitle} 
              onChange = {event => {
                //const newTitle = event.target.value;
                // setInputState(prevInputState => ({
                //   title: newTitle, 
                //   amount: prevInputState.amount
                // }))}
                setEnteredTitle(event.target.value);
              }}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input 
              type="number" 
              id="amount" 
              //value={inputState.amount}
              value={enteredAmount} 
              onChange = {event => {
                //const newAmount = event.target.value;
                // setInputState(prevInputState => ({
                //   amount: newAmount, 
                //   title: prevInputState.title
                // }))}
                setEnteredAmount(event.target.value);
              }}
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {props.isLoading ? <LoadingIndicator /> : null}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
