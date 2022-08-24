const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.

/** Takes in two parameters:
 * dataToUpdate is data to update existing users/companies
 * jsToSql is an object with keys as element's name in JavaScript,
 * and its value to be the element's name in SQL.
 * first, create an array composed of all the keys in datatoUpdate
 *
 * if array is empty since no data is passed in,
 * throw a BadRequestError("No data").
 *
 * otherwise, map they array to set the column name = $num for parametirized sql
 * return setCols which is a string of col name = $num, and
 * values as an array of dataToUpdate's values
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {

  //keys is an array of dataToUpdata object's keys
  const keys = Object.keys(dataToUpdate);

  if (keys.length === 0) throw new BadRequestError("No data");


  //keys array has ["firstname", "lastname",...] which plucks out the keys
  //of the data to be updated

  //we pluck out the value (or key if short-hand) and set it to $# for
  //parametirized queries for psql


  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    //join the array to get a string of ' "first_name"=$1 , "age"=$2 '
    setCols: cols.join(", "),
    //["Aliya", 32]
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
