import { useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import Button from "./button";

function RecipesSelected({
  privateScreen,
  deleteRecord,
  recordArray,
  showAll,
}) {
  const [pageNumber, setPageNumber] = useState(1);
  const [postNumber] = useState(20);

  // Pagination. Note that pagination currently is only set up for when all posts are shown
  // Calculate currentPageNumber as multiple of postNumber, starting at 0
  const currentPageNumber = pageNumber * postNumber - postNumber;

  //PaginatedPosts will be spliced from the total record set
  const splicy = [...recordArray];
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

  return (
    <div className="container">
      <div className="row">
        {recordArray.map((currentrecord) => {
          const { _id, image, title } = currentrecord;

          return (
            <div key={uuidv4()} className="recipe-home col-6 col-md-4 col-lg-3">
              <Link to={"/show/" + _id}>
                <div className="image-wrapper">
                  <img
                    className="recipe-image mb-2"
                    src={
                      image !== null && image.slice(0, 4) === "http"
                        ? image
                        : "./images/" + image
                    }
                    alt={title}
                  />
                </div>
                <div className="px-1 title">{title}</div>
              </Link>
              {privateScreen ? (
                <div className="px-1">
                  <Link to={"/edit/" + _id}>Edit</Link> |
                  <a
                    className="link"
                    onClick={() => {
                      deleteRecord(_id);
                      window.location.reload();
                    }}
                  >
                    Delete
                  </a>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          );
        })}
      </div>
      {showAll && (
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
      )}
    </div>
  );
}

export default RecipesSelected;
