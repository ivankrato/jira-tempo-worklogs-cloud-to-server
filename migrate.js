let axios = require('axios');
let mysql = require('mysql');
let xmlJs = require('xml-js');
require('dotenv').config();

let from = new Date(Date.parse(process.env.DATE_FROM));
let cur = new Date();
let dates = [
    {
        from: '2012-04-01',
        to: '2012-04-20'
    },
    {
        from: '2014-04-01',
        to: '2014-04-20'
    }
];
let promises = [];

for(let date of dates) {
    promises.push(axios.get('https://app.tempo.io/api/1/getWorklog?dateFrom=' + date.from + '&dateTo=' + date.to + '&format=xml&baseUrl='  + process.env.BASE_URL + '&tempoApiToken=' + process.env.TEMPO_API_TOKEN));
}


Promise.all(promises).then((values) => {
    for(let value of values) {
        let parsed = xmlJs.xml2json(value.data, {compact: true, spaces: 4});
        console.log(parsed);
    }
});

/*let con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});*/