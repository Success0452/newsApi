var _ = require('lodash');
const nodemailer = require('nodemailer');

var config = {
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user : 'olatundesuccess54@gmail.com',
        pass : 'wizziydhino1'
    }
}

var transporter = nodemailer.createTransport(config);

var defaultMail = {
    from: 'olatundesuccess54@gmail.com',
    text: 'test test'
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