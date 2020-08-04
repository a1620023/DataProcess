const mysql = require('promise-mysql');

const connection = mysql.createConnection({
    host: 'https://www.db4free.net/phpMyAdmin/',
    database: 'labmysql',
    user: 'emelceledonio',
    password: '58f2a287'
})

function getConnection(){ // esta función es para solicitar las veces que se requiera
    return connection;
}

module.exports = { getConnection } //exportamos este modulo

