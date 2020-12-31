const moment = require('moment');
const colors = require('colors');
const success = "request was successfull";

colors.enable();

const writeRequest = (req) => {
    console.log(colors.green(`{ time: ${moment().format('LLL')},  method: ${req.method},  url: ${req.url} }`));
};


const writeResponse = (req, res, message) => {

    if (message == undefined)
        message = success;

    const log = `{ time: ${moment().format('LLL')}  method: ${req.method}  status: ${res.statusCode}  message: ${message} } `;

    if (res.statusCode === 500)
        console.log(colors.red(log));
    else
        console.log(colors.green(log));

};




module.exports = { writeRequest, writeResponse };