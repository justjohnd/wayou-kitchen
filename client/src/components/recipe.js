import React from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function Recipe(props) {

console.log(props.privateScreen);

return (
<div className="recipe-home-container">
  {props.recordArray.map((currentrecord) => {
    return (
      <div key={uuidv4()} className="recipe-home">
        <Link to={'/show/' + currentrecord._id}>
          <img
            className="recipe-image mb-2 mx-2"
            src={
              currentrecord.image.slice(0, 4) === 'http'
                ? currentrecord.image
                : './images/' + currentrecord.image
            }
          />
          <div className="px-1 title">{currentrecord.title}</div>
        </Link>
        {props.privateScreen ? (
          <div className="px-1">
            <Link to={'/edit/' + currentrecord._id}>Edit</Link> |
            <a
              href="/"
              onClick={() => {
                props.deleteRecord(currentrecord._id);
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
</div>);
}

export default Recipe;
