let axios = require('axios');
let mysql = require('mysql');
let xmlJs = require('xml-js');
require('dotenv').config();

function dateRange(startDate, endDate) {
    let start      = startDate.split('-');
    let end        = endDate.split('-');
    let startYear  = parseInt(start[0]);
    let endYear    = parseInt(end[0]);
    let dates      = [];

    for(let i = startYear; i <= endYear; i++) {
        let endMonth = i !== endYear ? 11 : parseInt(end[1]) - 1;
        let startMon = i === startYear ? parseInt(start[1])-1 : 0;
        for(let j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j+1) {
            let month = j+1;
            let displayMonth = month < 10 ? '0'+month : month;
            dates.push([i, displayMonth, '01'].join('-'));
        }
    }
    return dates;
}

let log = process.argv.includes('--verbose') || process.argv.includes('-v');

let from = process.env.DATE_FROM;
let cur = new Date();
cur.setMonth(cur.getMonth() + 1);
let to = cur.toISOString().split('T')[0];
let dates = dateRange(from, to);
dates[0] = from;
let promises = [];

for(let i = 0; i < dates.length - 1; i++) {
    promises.push(axios.get('https://app.tempo.io/api/1/getWorklog?dateFrom=' + dates[i] + '&dateTo=' + dates[i + 1] + '&format=xml&baseUrl='  + process.env.BASE_URL + '&tempoApiToken=' + process.env.TEMPO_API_TOKEN));
}


Promise.all(promises).then((values) => {
    let logs = [];
    for(let value of values) {
        let response = JSON.parse(xmlJs.xml2json(value.data, {compact: true, spaces: 4}));
        logs = logs.concat(response.worklogs.worklog);
    }

    let con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    });

    con.connect(function(err) {
        if (err) throw err;
        if(log) console.log("Connected!");

        for(let log of logs) {
            let user = log.username._text;
            let jiraId = log.jira_worklog_id._text;
            let sql = 'UPDATE ' + process.env.DB_NAME + '.worklog SET AUTHOR = "' + user + '", UPDATEAUTHOR = "' + user + '" WHERE ID = "' + jiraId + '"';
            con.query(sql, function (err) {
                if (err) {
                    console.log('Error while processiong this command: ' + sql);
                    throw err;
                }
                if(log) console.log(sql + ' => DONE');
            });
        }

        con.end();
    });
});