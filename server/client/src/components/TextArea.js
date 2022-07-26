import { React, useState } from "react";

import "./TextArea.css";

export default function TextArea(props) {
  const [rows, setRows] = useState("");

  const changeHandler = (event) => {
    props.callbackFunction(event);
    const textareaLineHeight = 24;
    const minRows = 1;
    const maxRows = 10;

    const previousRows = event.target.rows;
    event.target.rows = minRows; // reset number of rows in textarea

    const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);

    if (currentRows === previousRows) {
      event.target.rows = currentRows;
    }

    if (currentRows >= maxRows) {
      event.target.rows = maxRows;
      event.target.scrollTop = event.target.scrollHeight;
    }

    setRows(() => {
      if (currentRows < maxRows) {
        return currentRows;
      } else {
        return maxRows;
      }
    });
  };

  return (
    <textarea
      rows={rows}
      className={props.className}
      name={props.name}
      type="text"
      value={props.value}
      onChange={changeHandler}
      placeholder={props.placeholder}
    ></textarea>
  );
}
