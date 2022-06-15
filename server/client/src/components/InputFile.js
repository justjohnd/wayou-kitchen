import React from "react";

export default function InputFile(props) {
  return (
    <div>
      <label
        htmlFor="file-upload"
        className={`btn btn-primary mx-3 ${props.wrapperClassName}`}
      >
        <input
          type="file"
          accept=".png, .jpg, .jpeg"
          name="image"
          id="file-upload"
          className={props.className}
          onChange={(e) => {
            props.imageCallback(e.target.files[0]);
          }}
        />
        "Change Image"
      </label>
    </div>
  );
}
