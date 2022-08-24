"use strict";
const { sqlForPartialUpdate } = require("./sql");

const { BadRequestError } = require("../expressError");


describe("sqlForPartialUpdate", function () {
  test("works when there's data", function () {
    const dataToUpdate = {
      firstName: "jon",
      lastName: "snow",
      email: "jonsnow@got.com"
    };
    const jsToSql = {
      firstName: "first_name",
      lastName: "last_name",
      isAdmin: "is_admin",
    };
    const update = sqlForPartialUpdate(dataToUpdate, jsToSql);
    expect(update).toEqual({
      setCols: '"first_name"=$1, "last_name"=$2, "email"=$3',
      values: ["jon", "snow", "jonsnow@got.com"]
    });
  });

  test("does not work when there's no data", function () {
    const dataToUpdate = {};
    const jsToSql = {
      firstName: "first_name",
      lastName: "last_name",
      isAdmin: "is_admin",
    };
    try {
      sqlForPartialUpdate(dataToUpdate, jsToSql);
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test("doesnt' change JS varaibles to SQL column names", function(){
    const dataToUpdate = {
      firstName: "jon",
      lastName: "snow",
      email: "jonsnow@got.com"
    };
    const jsToSql = {}

    const update = sqlForPartialUpdate(dataToUpdate, jsToSql)

    expect(update).not.toEqual({
      setCols: '"first_name"=$1, "last_name"=$2, "email"=$3',
      values: ["jon", "snow", "jonsnow@got.com"]
    });
    expect(update).toEqual({
      setCols: '"firstName"=$1, "lastName"=$2, "email"=$3',
      values: ["jon", "snow", "jonsnow@got.com"]
    })
  });

});
