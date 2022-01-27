import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import RecipeGroup from './recipeGroup';
import { categories } from '../javascript/categories';

export default function RecipeList() {
  const [record, setRecord] = useState({});
  const [records, setRecords] = useState([]);

  // This method will get the data from the database.
  useEffect(() => {
    axios
      .get('http://localhost:5000/record/')
      .then((response) => {
        // setRecords(response.data);
        for (let i = 0; i < response.data.length; i++) {
          if (!response.data[i].categories) {
            response.data[i].categories = [{value: 'other'}];
          } else if (response.data[i].categories.length === 0) {
          response.data[i].categories.push({value: 'other'});
        }
      }

      console.log(response.data);
        setRecords(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  // This method will delete a record based on the method
  function deleteRecord(id) {
    axios.delete('http://localhost:5000/' + id).then((response) => {
      console.log(response.data);
    });

    setRecord(() => {
      return records.filter((el) => el._id !== id);
    });
  }

  //Put records in their on groups
  const categoryTypes = categories.map((category) => category.value);
  console.log(categoryTypes);
  const groupArray = () => {

    let newArray = [];
    for (let i = 0; i < categories.length; i++) {
      const group = records.filter((record) => {


        if (record.categories[0].value === categoryTypes[i]) {
          return record;
        };
      });
      newArray.push(group);
    }

    return newArray;
  };

  const recordCategories = groupArray();
  console.log(recordCategories);

  // This following section will display the table with the records of individuals.
  return (
    <div className="p-3 container">
      <h3>Recipes</h3>
      {recordCategories.map((categoryRecords, index) => (
        <RecipeGroup
          key={uuidv4()}
          index={index}
          categoryTypes={categoryTypes}
          categoryRecords={categoryRecords}
          deleteRecord={deleteRecord}
        />
      ))}
    </div>
  );
}
