import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import useGetRecords from "../../hooks/useGetRecords";

import RecipesSelected from "../RecipesSelected";
import RecipeGroup from "../recipeGroup";
import CategoryDropdown from "../CategoryDropdown";
import Button from "../Button";

export default function Home({ loaderCallback }) {
  const records = useGetRecords("/record");
  const [showAll, setShowAll] = useState(true);
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

  useEffect(() => {
    loaderCallback(true);
    setTimeout(() => {
      loaderCallback(false);
    }, 1000);
  }, [categorizedRecords]);

  return (
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
            <h1 className="mb-4">Recently Added</h1>
            <RecipesSelected recordArray={paginatedPosts} />
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
                <RecipeGroup index={index} categoryRecords={categoryRecords} />
              </div>
            );
          })}
        </>
      ) : null}
    </div>
  );
}
