import nodemailer from 'nodemailer';
import config from '../config';

const sendMail = async (email: string, resetUILink: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'naimur.rezaa@gmail.com',
      pass: config.google_app_secret,
    },
  });

  await transporter.sendMail({
    from: 'naimur.rezaa@gmail.com', // sender address
    to: email, // list of receivers
    subject: 'Reset your university password', // Subject line
    text: 'Change your pass dada bhai!', // plain text body
    html: resetUILink, // html body
  });
};

export default sendMail;
