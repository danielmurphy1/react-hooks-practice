import React, { useState, useEffect } from 'react';

import Card from '../UI/Card';
import './Search.css';
import axios from 'axios';

const Search = React.memo(props => {
  const { onLoadIngredients } = props; //destructure so that props isnt a dependency completely but the function (which is an object) can be
  const [enteredFilter, setEnteredFilter] = useState("");

  useEffect(() => {
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
  }, [enteredFilter, onLoadIngredients])

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text" 
          value={enteredFilter} 
          onChange={event => setEnteredFilter(event.target.value)}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
