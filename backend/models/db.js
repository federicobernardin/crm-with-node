const mariadb = require('mariadb');

const pool = mariadb.createPool({
     host: 'db',
     user: 'db',
     password: 'db',
     database: 'db',
     connectionLimit: 5
});

module.exports = pool;