const nodemailer = require('nodemailer')


const sendEmail = async (options) => {

    const transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "05d24456f5fadb",
            pass: "fe6a496bf39f21"
        }
    });
    const message = {
        from: `${process.env.FROM_NAME} < ${process.env.FROM} >`,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    const info = await transport.sendMail(message)
    //console.log(`Messgae sent : %s`, info.messageId)
}

module.exports = sendEmail