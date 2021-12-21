import React from 'react';

function DataField(props) {

  return (
    <div>
      <div className="step-number">{props.index + 1}</div>
      <input
        onChange={(e) => props.editInstruction(props.index, e.target.value)}
        value={props.dataArray[props.index]}
      />
      <button onClick={e => {
        props.deleteInstruction(e, props.index);
        }}>Delete</button>
      <button onClick={e => props.insertInstruction(e, props.index)}>
        Insert Step Above
      </button>
    </div>
  );
}

export default DataField;
