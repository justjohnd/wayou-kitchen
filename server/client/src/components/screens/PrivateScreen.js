import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import Recipe from "../recipesSelected";
import Button from "../button";
import RecipeGroup from "../recipeGroup";
import CategoryDropdown from "../categoryDropdown";

import { categories } from "../../javascript/categories";
import httpAddress from "../../javascript/httpAddress";
import {
  setWithExpiry,
  getWithExpiry,
} from "../../hooks/localStorageWithExpiry";

const PrivateScreen = (props) => {
  const [error, setError] = useState("");
  const [privateScreen, setPrivateScreen] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState(null);
  const [recordCategories, setRecordCategories] = useState(null);
  const [records, setRecords] = useState("");
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

  let navigate = useNavigate();

  useEffect(() => {
    if (!getWithExpiry("authToken")) {
      navigate("/login");
      setError("Sorry, you are not logged in.");
    }

    const fetchPrivateData = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getWithExpiry("authToken")}`,
        },
      };

      try {
        const { data } = await axios.get("/api/private", config);

        for (let i = 0; i < data.records.length; i++) {
          // Verify lastModified data is available, if not, add arbitrary older date to place those items at bottom of list
          if (!data.records[i].lastModified) {
            data.records[i].lastModified = new Date(
              data.records[i].dateCreated
            );
          }
          // Verify catagegories data is available. If not add value: other
          if (!data.records[i].categories) {
            data.records[i].categories = [{ value: "other" }];
          } else if (data.records[i].categories.length === 0) {
            data.records[i].categories.push({ value: "other" });
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
        setWithExpiry("userId", data.id);
      } catch (error) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        setError("You are not authorized please login");
        console.log(error);
      }
    };

    fetchPrivateData();
  }, []);

  // This method will delete a record based on the method
  const deleteRecord = async (id) => {
    try {
      await axios.delete(`${httpAddress}/${id}`);
    } catch (error) {
      setError(error.response.data.error);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  //Select by categories
  function categoriesCallback(optionSelected) {
    setSelectedCategories(optionSelected);
    //Put records in their on groups
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
      return (
        <div>
          <Recipe
            privateScreen={privateScreen}
            recordArray={paginatedPosts}
            deleteRecord={deleteRecord}
          />
          {paginatedPosts.length > 0 && (
            <div className="pagination-wrapper">
              <div className="d-flex justify-content-center">
                Page {pageNumber}{" "}
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
  return error ? (
    <span className="error-message d-flex justify-content-center">{error}</span>
  ) : (
    <div className="p-3 container disable-while-loading">
      <div className="ms-3">
        <CategoryDropdown
          className="ms-3"
          selectedCategories={selectedCategories}
          categoriesCallback={categoriesCallback}
        ></CategoryDropdown>
      </div>
      <h1 className="mb-4 ms-3">My Recipes</h1>
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
