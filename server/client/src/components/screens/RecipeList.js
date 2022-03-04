import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { categories } from '../../javascript/categories';
import Recipe from '../recipe';
import RecipeGroup from '../recipeGroup';
import CategoryDropdown from '../categoryDropdown';
import useGetRecords from "../../hooks/useGetRecords";
import Button from '../button';

export default function RecipeList() {
  const records = useGetRecords("/record");
  const [selectedCategories, setSelectedCategories] = useState(null);
  const [recordCategories, setRecordCategories] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [postNumber] = useState(20);

  const currentPageNumber = pageNumber * postNumber - postNumber;

  const splicy = [...records];
  const paginatedPosts = splicy.splice(currentPageNumber, postNumber);

  const handlePrev = () => {
    if (pageNumber === 1) return;
    setPageNumber(pageNumber - 1);
  };

  const handleNext = () => {
    setPageNumber(pageNumber + 1);
  };

  // console.log('paginatedPosts: ', paginatedPosts);
  // console.log('categoryRecords: ', records);
  // console.log('pag length: ', paginatedPosts.length);
  // console.log('currentPageNumber: ', currentPageNumber);
  console.log(recordCategories);


  //Select by categories
  function categoriesCallback(optionSelected) {
    setSelectedCategories(optionSelected);
    //Put records in their on groups for display
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
    }

    const groupsToShow = groupArray();
    setRecordCategories(groupsToShow);
  }

function displayAll() {
  if (selectedCategories === null || selectedCategories.length === 0) {
    return (
      <div>
        <Recipe recordArray={paginatedPosts} />
        {paginatedPosts.length > 0 && (
          <div className="pagination-wrapper">
            <div className="d-flex justify-content-center">
              Page {pageNumber}{' '}
            </div>
            <div className="d-flex">
              <Button
                buttonWrapper="w-50"
                className="float-end me-2"
                buttonText="Previous"
                onClick={handlePrev}
              />
              {paginatedPosts.length > currentPageNumber && (
                <Button
                  buttonWrapper="w-50 text-left"
                  className="float-start ms-2"
                  buttonText="Next"
                  onClick={handleNext}
                />
              )}
            </div>
          </div>
        )}
      </div>
    );
  } 
}

  // This following section will display the table with the records of individuals.
  return (
    <div className="p-3 container disable-while-loading">
      <div className="ms-3">
        <CategoryDropdown
          selectedCategories={selectedCategories}
          categoriesCallback={categoriesCallback}
        ></CategoryDropdown>
      </div>
      <h1 className="mb-4 ms-3">Recipes</h1>
      {displayAll()}
      {recordCategories ? (
        recordCategories.map((categoryRecords, index) => {
          if (categoryRecords !== []) {
            return (
              <div>
                <RecipeGroup
                  key={uuidv4()}
                  index={index}
                  categoryRecords={categoryRecords}
                />
              </div>
            );
          }
        })
      ) : (
        <div></div>
      )}
    </div>
  );
}
