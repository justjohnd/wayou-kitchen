import axios from 'axios';
import { React, useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function Recipe(props) {
return (
<div className="recipe-home-container">
  {props.recordArray.map((currentrecord) => {
    return (
      <div key={uuidv4()} className="recipe-home">
        <Link to={'/show/' + currentrecord._id}>
          <img
            className="recipe-image mb-2 mx-sm-2"
            src={currentrecord.image}
            alt={currentrecord.title}
          />
          <div className="px-1 title">{currentrecord.title}</div>
        </Link>
        {props.privateScreen ? (
          <div className="px-1">
            <Link to={'/edit/' + currentrecord._id}>Edit</Link> |
            <a 
            className="link"
            onClick={() => {
                props.deleteRecord(currentrecord._id);
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
</div>);
}

export default Recipe;
