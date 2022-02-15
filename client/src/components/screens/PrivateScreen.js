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
  const [data, setData] = useState('data');
  const [privateScreen, setPrivateScreen] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState(null);
  const [recordCategories, setRecordCategories] = useState(null);
  const [records, setRecords] = useState('');

  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      navigate("/login");
    }

    const fetchPrivateDate = async () => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      };

      try {
        const { data } = await axios.get('/api/private', config);
        setData(data.data);
        setRecords(data.records);
        localStorage.setItem('userId', data.id);
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        setError('You are not authorized please login');
      }
    };

    fetchPrivateDate();
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
