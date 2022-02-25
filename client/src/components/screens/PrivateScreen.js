import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { categories } from '../../javascript/categories';
import Recipe from '../recipe';
import RecipeGroup from '../recipeGroup';
import CategoryDropdown from '../categoryDropdown';

const PrivateScreen = (props) => {
  const [error, setError] = useState('');
  const [privateScreen, setPrivateScreen] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState(null);
  const [recordCategories, setRecordCategories] = useState(null);
  const [records, setRecords] = useState('');

  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      navigate("/login");
      setError('Sorry, you are not logged in.');
    }

    const fetchPrivateData = async () => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      };

      try {
        const { data } = await axios.get('/api/private', config);

        for (let i = 0; i < data.records.length; i++) {
          // Verify lastModified data is available, if not, add arbitrary older date to place those items at bottom of list
          if (!data.records[i].lastModified) {
            data.records[i].lastModified = new Date(
              data.records[i].dateCreated
            );
          }
          // Verify catagegories data is available. If not add value: other
          if (!data.records[i].categories) {
            data.records[i].categories = [{ value: 'other' }];
          } else if (data.records[i].categories.length === 0) {
            data.records[i].categories.push({ value: 'other' });
          }
        }

        //Order recipes for display with most recent data created first
        const ordered = [];

        while (data.records.length > 0) {
          const minValue = data.records.reduce((prev, cur) => {
            const prevInt = new Date(prev.lastModified).getTime();
            const curInt = new Date(cur.lastModified).getTime();
            if (prevInt > curInt) {
              return prev;
            } else {
              return cur;
            }
          });

          ordered.push(minValue);

          const minValueIndex = data.records.indexOf(minValue);
          data.records.splice(minValueIndex, 1);
        }

        setRecords(ordered);
        localStorage.setItem('userId', data.id);
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        props.sessionExpiredCallback(true);
        setError('You are not authorized please login');
        console.log(error);
      }
    };

    fetchPrivateData();
  }, []);

// This method will delete a record based on the method
const deleteRecord = async (id) => {
  try {
    await axios.delete('http://localhost:5000/' + id);
  } catch (error) {
    setError(error.response.data.error);
    setTimeout(() => {
      setError('');
    }, 5000);
  }
}

//Select by categories
function categoriesCallback(optionSelected) {
  setSelectedCategories(optionSelected);
  //Put records in their on groups
  console.log(optionSelected);
  const categoryTypes = optionSelected.map((category) => category.value);

  const groupArray = () => {
    let newArray = [];
    for (let i = 0; i < categories.length; i++) {
      const group = records.filter((record) => {
        if (record.categories[0].value === categoryTypes[i]) {
          return record;
        }
      });
      newArray.push(group);
    }

    return newArray;
  };

  const groupsToShow = groupArray();
  setRecordCategories(groupsToShow);
}

function displayAll() {
  if (selectedCategories === null || selectedCategories.length === 0) {
    return <Recipe privateScreen={privateScreen} recordArray={records} deleteRecord={deleteRecord} />;
  }
}

// This following section will display the table with the records of individuals.
return (
  error ? (
    <span className="error-message">{error}</span>
  ) : <div className="p-3 container disable-while-loading">
    <div className="ms-3">
      <CategoryDropdown
        className="ms-3"
        selectedCategories={selectedCategories}
        categoriesCallback={categoriesCallback}
      ></CategoryDropdown>
    </div>
    <h1 className="mb-4 ms-3">Recipes</h1>
    {records ? displayAll() : <div></div>}
    {recordCategories ? (
      recordCategories.map((categoryRecords, index) => {
        if (categoryRecords !== []) {
          return (
            <RecipeGroup
              key={uuidv4()}
              index={index}
              categoryRecords={categoryRecords}
              deleteRecord={deleteRecord}
              privateScreen={privateScreen}
            />
          );
        }
      })
    ) : (
      <div></div>
    )}
  </div>
);
};

export default PrivateScreen;
