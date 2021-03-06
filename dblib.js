require("dotenv").config();
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const getTotalRecords = () => {
    sql = "SELECT COUNT(*) FROM  books";
    return pool.query(sql)
        .then(result => {
            return {
                msg: "success",
                totRecords: result.rows[0].count
            }
        })
        .catch(err => {
            return {
                msg: `Error ${err.message}`
            }
        });
};

const insertCustomer = (customer) => {
    if (customer instanceof Array) {
        params = customer;
    } else {
        params = Object.values(customer);
    };
    const sql = `INSERT INTO customer (book_id,	title,
	total_pages, rating, isbn,
	published_date	DATE)
                 VALUES ($1, $2, $3, $4, $5, $6)`;
    return pool.query(sql, params)
        .then(res => {
            return {
                trans: "success",
                msg: `customer id ${params[0]} successfully inserted`
            };
        })
        .catch(err => {
            return {
                trans: "fail",
                msg: `Error on insert of customer id ${params[0]}.  ${err.message}`
            };
        });
};

const scust = () => {
    const sql = "SELECT * FROM customer ORDER BY cusLname asc";
    return pool.query(sql) 
    .then(report => {
        return {
            trans:"success",
            obl: report.rows
        }
    })
    .catch(err => {
        return{
            trans: "fail",
            msg: `${err.message}`
        }
    });
};

const ssales = () => {
    const sql = "SELECT * FROM customer ORDER BY cusSalesYTD desc";
    return pool.query(sql)
    .then(report => {
        return {
            trans: "success",
            obs: report.rows
        }
    })
    .catch(err => {
        return{
            trans: "fail",
            msg: `${err.message}`
        }
    });
};

const random = () => {
    const sql = "SELECT * FROM customer ORDER BY RANDOM() LIMIT 3";
    return pool.query (sql)
    .then(report => {
        return {
            trans: "success",
            obr: report.rows
        }
    })
    .catch(err => {
        return{
            trans: "fail",
            msg: `${err.message}`
        }
    });
};

const findCustomer = (customer) => {

    var i = 1;
    params = [];
    sql = "SELECT * FROM customer WHERE true";

    // Check data provided and build query as necessary
    if (customer.cusId !== "") {
        params.push(parseInt(customer.cusId));
        sql += ` AND cusId = $${i}`;
        i++;
    };
    if (customer.cusFname !== "") {
        params.push(`${customer.cusFname}%`);
        sql += ` AND UPPER(cusFname) LIKE UPPER($${i})`;
        i++;
    };
    if (customer.cusLname !== "") {
        params.push(`${customer.cusLname}%`);
        sql += ` AND UPPER(cusLname) LIKE UPPER($${i})`;
        i++;
    };
    if (customer.cusState !== "") {
        params.push(`${customer.cusState}%`);
        sql += ` AND UPPER(cusState) LIKE UPPER($${i})`;
        i++;
    };
    if (customer.cusSalesYTD !== "") {
        params.push(parseFloat(customer.cusSalesYTD));
        sql += ` AND cusSalesYTD >= $${i}`;
        i++;
    };
    if (customer.cusSalesPrev !== "") {
        params.push(parseFloat(customer.cusSalesPrev));
        sql += ` AND cusSalesPrev >= $${i}`;
        i++;
    };

    sql += ` ORDER BY cusId`;
    console.log("sql: " + sql);
    console.log("params: " + params);

    return pool.query(sql, params)
        .then(result => {
            return {
                trans: "success",
                result: result.rows
            }
        })
        .catch(err => {
            return {
                trans: "Error",
                result: `Error: ${err.message}`
            }
        });
};

module.exports.findCustomer = findCustomer;
module.exports.insertCustomer = insertCustomer;
module.exports.getTotalRecords = getTotalRecords;
module.exports.scust = scust;
module.exports.ssales = ssales;
module.exports.random = random;