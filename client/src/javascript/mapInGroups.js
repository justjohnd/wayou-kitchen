//This function takes an array of objects and returns an aray of arrays, within each one the objects are organized based on a common property value.

//**Note** This function will only work if the 'property' argument is a top level property in the objects

//Arguments: 'array' is the name of the array of objects. 'property' is the property by which the objects will be separated into different arrays.

//Find maximum number of possible ingredient groups presented on the page
function mapInGroups(array, property) {

  const setUndefined = array.map((item) => {
  if (!item[property]) {
    item[property] = 0;
  }
  return item[property];
});

const maxGroupNumber = Math.max(...setUndefined);
const numberOfGroups = maxGroupNumber + 1;

//Put ingredients in their on groups
const groupArray = (numberOfGroups) => {
  let newArray = [];
  for (let i = 0; i < numberOfGroups; i++) {
    const group = array.filter((item) => item[property] === i);
    newArray.push(group);
  }

  return newArray;
};

  return groupArray(numberOfGroups);
}

export default mapInGroups();
