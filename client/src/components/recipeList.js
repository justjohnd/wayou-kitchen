import React, { useState, useEffect } from 'react';
// This will require to npm install axios
import axios from 'axios';
import { Link } from 'react-router-dom';

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

  console.log(records);

  //Put records in their on groups
  const groupArray = () => {
    const categoryTypes = categories.map(category => category.value);

    let newArray = [];
    for (let i = 0; i < categories.length; i++) {
      const group = records.filter((record) => {
        if (record.categories === undefined) {
          record.categories = [];
          record.categories[0] = "other";
        }
        return record.categories[0] === categoryTypes[i];
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
      <div className="recipe-home-container">
        {records.map((currentrecord) => {
          return (
            <div className="recipe-home">
              <img
                className="recipe-image mb-2"
                src={
                  currentrecord.image.slice(0, 4) === 'http'
                    ? currentrecord.image
                    : './images/' + currentrecord.image
                }
              />
              <div className="px-1 title">{currentrecord.title}</div>
              <div className="px-1">
                <Link to={'/show/' + currentrecord._id}>Show</Link> |
                <Link to={'/edit/' + currentrecord._id}>Edit</Link> |
                <a
                  href="/"
                  onClick={() => {
                    deleteRecord(currentrecord._id);
                  }}
                >
                  Delete
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
