"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js")
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  jobs
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newJob = {
    title: "newJob",
    salary: 10,
    equity: "0.9",
    companyHandle: "c1"
  };

  test("works", async function () {
    let job = await Job.create(newJob);
    // expect(job).toEqual(newJob);


    const result = await db.query(
      `SELECT title, salary, equity, company_handle
           FROM jobs
           WHERE id = ${job.id}`);
    expect(result.rows).toEqual([
      {
        title: "newJob",
        salary: 10,
        equity: "0.9",
        company_handle: "c1"
      },
    ]);
  });


  // test("bad request with dupe", async function () {
  //   try {
  //     await Company.create(newJob);
  //     await Company.create(newJob);
  //     throw new Error("fail test, you shouldn't get here");
  //   } catch (err) {
  //     expect(err instanceof BadRequestError).toBeTruthy();
  //   }
  // });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let jobs = await Job.findAll();
    expect(jobs).toEqual([
      {
        title: "j1",
        salary: 1,
        equity: "0.1",
        companyHandle: "c1"
      },
      {
        title: "j2",
        salary: 2,
        equity: "0.2",
        companyHandle: "c2"
      },
      {
        title: "j3",
        salary: 3,
        equity: "0.3",
        companyHandle: "c3"
      },
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    console.log("JOBSS", jobs)

    let getJob = await Job.get(jobs[0].id);

    expect(getJob).toEqual({
      title: jobs[0].title,
      salary: jobs[0].salary,
      equity: jobs[0].equity,
      companyHandle: jobs[0].company_handle
    });

  });

  test("not found if no such job", async function () {
    try {
      await Job.get(0);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

