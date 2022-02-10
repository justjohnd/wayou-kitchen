import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { categories } from '../../javascript/categories';
import Recipe from '../recipe';
import RecipeGroup from '../recipeGroup';
import CategoryDropdown from '../categoryDropdown';
import useGetRecords from '../../hooks/useGetRecords';

const PrivateScreen = (props) => {
  const [error, setError] = useState('');
  const [data, setData] = useState('data');

  let navigate = useNavigate();

  useEffect(() => {
    props.loginStatusCallback(true);
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
        localStorage.setItem('userId', data.id);
      } catch (error) {
        localStorage.removeItem('authToken');
        setError('You are not authorized please login');
      }
    };

    fetchPrivateDate();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate("/login");
  }

const [record, setRecord] = useState({});
const records = useGetRecords();
const [selectedCategories, setSelectedCategories] = useState(null);
const [recordCategories, setRecordCategories] = useState(null);

// This method will delete a record based on the method
function deleteRecord(id) {
  axios.delete('http://localhost:5000/' + id).then((response) => {
    console.log(response.data);
  });

  setRecord(() => {
    return records.filter((el) => el._id !== id);
  });
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
    return <Recipe recordArray={records} deleteRecord={deleteRecord} />;
  }
}

// This following section will display the table with the records of individuals.
return (
  <div className="p-3 container disable-while-loading">
    <CategoryDropdown
      className="ms-3"
      selectedCategories={selectedCategories}
      categoriesCallback={categoriesCallback}
    ></CategoryDropdown>
    <h1 className="mb-4 ms-3">Recipes</h1>
    {displayAll()}
    {recordCategories ? (
      recordCategories.map((categoryRecords, index) => {
        if (categoryRecords !== []) {
          return (
            <RecipeGroup
              key={uuidv4()}
              index={index}
              categoryRecords={categoryRecords}
              deleteRecord={deleteRecord}
            />
          );
        }
      })
    ) : (
      <div></div>
    )}
  </div>
);

  // return 
  // error ? (
  //   <span className="error-message">{error}</span>
  // ) : (
  //   <div>
  //     {data}
  //     <button onClick={handleLogout}>Logout</button>
  //   </div>
  // );
};

export default PrivateScreen;
