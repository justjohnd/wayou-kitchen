import React from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function Recipe(props) {
return (
<div className="recipe-home-container">
  {props.recordArray.map((currentrecord) => {
    return (
      <div key={uuidv4()} className="recipe-home">
        <img
          className="recipe-image mb-2 mx-2"
          src={
            currentrecord.image.slice(0, 4) === 'http'
              ? currentrecord.image
              : './images/' + currentrecord.image
          }
        />
        <div className="px-1 title">{currentrecord.title}</div>
        <div className="px-1">
          <Link to={'/show/' + currentrecord._id}>Show</Link> |
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
      </div>
    );
  })}
</div>);
}

export default Recipe;