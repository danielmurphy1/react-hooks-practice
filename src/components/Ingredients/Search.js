import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';
import axios from 'axios';

const Search = React.memo(props => {
  const { onLoadIngredients } = props; //destructure so that props isnt a dependency completely but the function (which is an object) can be
  const [enteredFilter, setEnteredFilter] = useState("");
  const inputRef = useRef(); //assign to a DOM element to know what the value will be (this case the text <input>)

  useEffect(() => {
    const timer = setTimeout(() =>{         //use setTimeout to check if the useEffect dependecy has stopped for an amount of time so that the http req is only sent then and not each keystroke for enteredFilter
      if (enteredFilter === inputRef.current.value) { //enteredFilter will be the value when the time is set (on the render) because of JS closures - not the value at end of 500ms. 
                                                      //Need reference (useRef) to compare to current value. inputRef.current.value will be the current value after 500ms in the <input>
        const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
        axios.get('https://react-hooks-practice-62927-default-rtdb.firebaseio.com/ingredients.json' + query).then(
        
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
          onLoadIngredients(loadedIngredients);
        console.log(loadedIngredients)
      // fetch('https://react-hooks-practice-62927-default-rtdb.firebaseio.com/ingredients.json' + query).then(
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
      //     // onLoadIngredients(loadedIngredients);
  
      //      console.log(loadedIngredients)
        }
      )
      }                                                
      
    }, 500);
    return () => { //if use a return, must be a function. Called a cleanup function. Runs RIGHT BEFORE component render cycle (due to dependencies). 
                  //If no dependencies, will run when component is UNMOUNTED
      clearTimeout(timer); //clears the timer that is created with previous keystoke so there are not multiple timers running
    }
    
  }, [enteredFilter, onLoadIngredients, inputRef])

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input 
          ref={inputRef}
          type="text" 
          value={enteredFilter} 
          onChange={event => setEnteredFilter(event.target.value)}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
