import React from "react";

export default function Button(props) {
  return (
    <div className={props.buttonWrapper}>
      <button
        type={props.type || "button"}
        className={`btn ${props.className} ${
          props.buttonStyle || "btn-primary"
        }`}
        onClick={props.onClick}
      >
        {props.buttonText}
      </button>
    </div>
  );
}
