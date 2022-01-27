import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import RecipeGroup from './recipeGroup';
import { categories } from '../javascript/categories';
import Recipe from './recipe';

export default function RecipeList() {
  const [record, setRecord] = useState({});
  const [records, setRecords] = useState([]);

  // This method will get the data from the database.
  useEffect(() => {
    axios
      .get('http://localhost:5000/record/')
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          // Verify lastModified data is available, if not, add arbitrary older date to place those items at bottom of list
          if (!response.data[i].lastModified) {
            response.data[i].lastModified = new Date('August 19, 1975 23:15:30');
          }
          // Verify catagegories data is available. If not add value: other
          if (!response.data[i].categories) {
            response.data[i].categories = [{ value: 'other' }];
          } else if (response.data[i].categories.length === 0) {
            response.data[i].categories.push({ value: 'other' });
          }
        }

        //Order recipes for display with most recent data created first
        const ordered = [];

        while (response.data.length > 0) {
          const minValue = response.data.reduce((prev, cur) => {
            if (prev.lastModified > cur.lastModified) {
              return prev;
            } else {
              return cur;
            }
          });

          ordered.push(minValue);

          const minValueIndex = response.data.indexOf(minValue);
          response.data.splice(minValueIndex, 1);
        }

        setRecords(ordered);
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

  // This following section will display the table with the records of individuals.
  return (
    <div className="p-3 container">
      <h3>Recipes</h3>
      <Recipe
      recordArray={records}
      deleteRecord={deleteRecord}
      />
      {/* {recordCategories.map((categoryRecords, index) => (
        <RecipeGroup
          key={uuidv4()}
          index={index}
          categoryTypes={categoryTypes}
          categoryRecords={categoryRecords}
          deleteRecord={deleteRecord}
        />
      ))} */}
    </div>
  );
}
