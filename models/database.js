const { Pool } = require('pg');

// const pool = new Pool({
//         host: 'localhost',
//         user:"postgres",
//         password : "1234",
//         port:5432,
//         database:'job',
//         max: 80,
//         idleTimeoutMillis: 0,
//         connectionTimeoutMillis: 0,
//       });

const pool = new Pool({
    host: 'localhost',
    user: "postgres",
    password: "1234",
    port: 5432,
    database: 'messenger2',
    max: 80,
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0,
});

// const pool = new Pool({
//         host: 'hansken.db.elephantsql.com',
//         user:"vgdbyrif",
//         password: "0s3nZhxppN9hXz0FqCP7Gb9wjJ8GjUQ-",
//         port:5432,
//         database:'vgdbyrif',
//         max: 80,
//         idleTimeoutMillis: 0,
//         connectionTimeoutMillis: 0,
//       });


function getclient() {
    try {
        const client = pool.connect();
        return client;
    } catch (e) {
        console.log(e)
    }

};


// async function getclient2 (){
//     const client = new Client({
//         host: "localhost",
//         port: 5432,
//         user:"postgres",
//         password : "1234",
//         database: "x"
//     });
//     await client.connect();

//     return client
// };


// async function runq(c,q,v){
// const c= await client();
// let result;
// if(v)
// result=await c.query(q,v);
// else 
// result=await c.query(q);
// return result;
// }
module.exports.Pool = pool;
module.exports.getclient = getclient;
// module.exports.getclient2=getclient2;