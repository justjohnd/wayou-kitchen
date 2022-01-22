  import React, { Component } from 'react';
// This will require to npm install axios
import axios from 'axios';
import { Link } from 'react-router-dom';

const Record = (props) => (
  <tr>
    <td><img className="recipe-image small" src={props.record.image.slice(0, 4) === 'http' ? props.record.image : '/images/' + props.record.image}/></td>
    <td>{props.record.title}</td>
    <td>{props.record.preparationMinutes}</td>
    <td>{props.record.cookingMinutes}</td>
    <td>
      <Link to={'/show/' + props.record._id}>Show</Link> |
      <Link to={'/edit/' + props.record._id}>Edit</Link> |
      <a
        href="/"
        onClick={() => {
          props.deleteRecord(props.record._id);
        }}
      >
        Delete
      </a>
    </td>
  </tr>
);

export default class RecipeList extends Component {
  // This is the constructor that shall store our data retrieved from the database
  constructor(props) {
    super(props);
    this.deleteRecord = this.deleteRecord.bind(this);
    this.state = { records: [] };
  }

  // This method will get the data from the database.
  componentDidMount() {
    axios
      .get('http://localhost:5000/record/')
      .then((response) => {
        this.setState({ records: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // This method will delete a record based on the method
  deleteRecord(id) {
    axios.delete('http://localhost:5000/' + id).then((response) => {
      console.log(response.data);
    });

    this.setState({
      record: this.state.records.filter((el) => el._id !== id),
    });
  }

  // This method will map out the users on the table
  recipeList() {
    return this.state.records.map((currentrecord) => {
      return (
        <Record
          record={currentrecord}
          deleteRecord={this.deleteRecord}
          key={currentrecord._id}
        />
      );
    });
  }

  // This following section will display the table with the records of individuals.
  render() {
    return (
      <div className="p-3">
        <h3>Recipes</h3>
        <table className="table table-striped" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Preparation Minutes</th>
              <th>Cooking Minutes</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{this.recipeList()}</tbody>
        </table>

      </div>
    );
  }
}
