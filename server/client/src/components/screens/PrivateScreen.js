import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import RecipesSelected from "../RecipesSelected";
import Button from "../Button";
import RecipeGroup from "../recipeGroup";
import CategoryDropdown from "../CategoryDropdown";

import httpAddress from "../../javascript/httpAddress";
import {
  setWithExpiry,
  getWithExpiry,
} from "../../hooks/localStorageWithExpiry";

const PrivateScreen = ({loaderCallback}) => {
  const [error, setError] = useState("");
  const [privateScreen, setPrivateScreen] = useState(true);
  const [showAll, setShowAll] = useState(true);
  const [records, setRecords] = useState("");
  const [categorizedRecords, setCategorizedRecords] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [postNumber] = useState(20);

  // Pagination. Note that pagination currently is only set up for when all posts are shown
  // Calculate currentPageNumber as multiple of postNumber, starting at 0
  const currentPageNumber = pageNumber * postNumber - postNumber;

  //PaginatedPosts will be spliced from the total record set
  const splicy = [...records];
  let paginatedPosts = splicy.splice(currentPageNumber, postNumber);

  const handlePrev = () => {
    if (pageNumber === 1) return;
    setPageNumber(pageNumber - 1);
    window.scrollTo(0, 0);
  };

  const handleNext = () => {
    setPageNumber(pageNumber + 1);
    window.scrollTo(0, 0);
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

      loaderCallback(true);

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
        loaderCallback(false);
      } catch (error) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        loaderCallback(false);
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

  return error ? (
    <span className="error-message d-flex justify-content-center">{error}</span>
  ) : (
    <div className="p-3 container disable-while-loading">
      <div>
        <CategoryDropdown
          setShowAll={setShowAll}
          setCategorizedRecords={setCategorizedRecords}
          records={records}
        ></CategoryDropdown>
      </div>

      {showAll ? (
        <>
          <div>
            <h1 className="mb-4">My Recipes</h1>
            <RecipesSelected
              recordArray={paginatedPosts}
              deleteRecord={deleteRecord}
              privateScreen={privateScreen}
            />
          </div>

          <div className="pagination-wrapper">
            <div className="d-flex justify-content-center">
              Page {pageNumber}{" "}
            </div>
            <div className="d-flex">
              <Button
                buttonWrapper="w-50"
                className={`float-end me-2 ${pageNumber === 1 && "disabled"}`}
                buttonText="Previous"
                onClick={handlePrev}
              />
              <Button
                buttonWrapper="w-50 text-left"
                className={`float-start ms-2 ${
                  paginatedPosts.length < postNumber && "disabled"
                }`}
                buttonText="Next"
                onClick={handleNext}
              />
            </div>
          </div>
        </>
      ) : categorizedRecords ? (
        <>
          {categorizedRecords.map((categoryRecords, index) => {
            return (
              <div key={uuidv4()}>
                <RecipeGroup
                  index={index}
                  categoryRecords={categoryRecords}
                  deleteRecord={deleteRecord}
                  privateScreen={privateScreen}
                />
              </div>
            );
          })}
        </>
      ) : null}
    </div>
  );
};

export default PrivateScreen;
