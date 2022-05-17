require('dotenv').config();
var _ = require('lodash');
const nodemailer = require('nodemailer');

var config = {
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user :  process.env.EMAIL,
        pass :  process.env.PASSWORD
    }
}

var transporter = nodemailer.createTransport(config);

var defaultMail = {
    from:  process.env.EMAIL,
    text:  process.env.TEST
}

const send = (to, subject, html) => {

    mail = _.merge({html}, defaultMail, to);

    transporter.sendMail(mail, function(error, info){
        if(error) console.log(error);
        console.log('mail sent', info.response);
    })
}

module.exports ={
    send
}