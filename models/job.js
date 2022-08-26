"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Job {

  /** Create a job (from data), update db, return new job data
   *
   * data should be {title, salary, equity, company_handle}
   *
   * Returns {title, salary, equity, company_handle}
   *
   */


  static async create({ title, salary, equity, companyHandle }) {

    const result = await db.query(
      `INSERT INTO jobs(
          title,
          salary,
          equity,
          company_handle)
      VALUES
        ($1, $2, $3, $4)
      RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
      [
        title,
        salary,
        equity,
        companyHandle
      ],
    );
    const job = result.rows[0];

    return job;
  }

  /** Find all jobs.
 *
 * Returns [{title, salary, equity, company_handle}, ...]
 * */

  static async findAll(data = {}) {

    const jobsRes = await db.query(
      `SELECT title,
              salary,
              equity,
              company_handle AS "companyHandle"
      FROM jobs
      ORDER BY title`);
    return jobsRes.rows;
  }

  static async get(id) {
    console.log(await db.query(`SELECT id FROM jobs WHERE title = 'j1'`))
    const jobRes = await db.query(
      `SELECT title,
              salary,
              equity,
              company_handle AS "companyHandle"
      FROM jobs
      WHERE id = $1`,
      [id]);

    const job = jobRes.rows[0];

    if (!job) throw new NotFoundError(`No job id: ${id}`);

    return job;
  }

}



module.exports = Job;