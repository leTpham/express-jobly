const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.

/** Takes in two parameters:
 * dataToUpdate is data to update existing users/companies
 * jsToSql is an object with keys as element's name in JavaScript,
 * and its value to be the element's name in SQL.
 *
 * If array is empty since no data is passed in,
 * throw a BadRequestError("No data").
 *
 * Otherwise, return setCols which is a string of col name = $num, and
 * values as an array of dataToUpdate's values
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);

  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    //join the array to get a string of ' "first_name"=$1 , "age"=$2 '
    setCols: cols.join(", "),

    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
