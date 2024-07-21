import mailer from 'nodemailer';
import config from './env-config.js';

export default class MailingService {
    constructor() {
        this.client = mailer.createTransport({
            service: config.mailing.service,
            port:465,
            secure: true,
            secureConnection: false,
            debug: true,
            auth: {
                user: config.mailing.user,
                pass: config.mailing.password 
            },
            tls:{
                rejectUnAuthorized:true
            }
        })

    }
    sendSimpleMail({ from, to, subject, text }) {
        return new Promise((resolve, reject) => {
          this.client.sendMail({
            from,
            to,
            subject,
            text
          })
            .then((result) => {
              console.log('Email sent: ' + result.response);
              resolve(result);
            })
            .catch((error) => {
              console.error('Failed to send email:', error);
              reject(error);
            });
        });
      }


}