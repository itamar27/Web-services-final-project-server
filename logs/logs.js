const moment = require('moment');
const colors = require('colors');

colors.enable();

exports.writeLog = (req,res)=>{
    let message =`{ time: ${moment().format('LLL')} }, { method: ${req.method} }, { url: ${req.url} }, { status: ${res.statusCode} }`;

    if(res.statusCode === 200)
        console.log(colors.green(message));

    if(res.statusCode === 400)
        console.log(colors.yellow(message));

    if(res.statusCode === 500)
        console.log(colors.red(message));
};

