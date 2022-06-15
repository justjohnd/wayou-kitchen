import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function RecipesSelected({ recordArray, privateScreen, deleteRecord }) {
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
    </div>
  );
}

export default RecipesSelected;
