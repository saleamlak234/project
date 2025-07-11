const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter using Gmail
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
  },
});

const sendEmail = async ({ sendTo, subject, html }) => {
  try {
    const mailOptions = {
      from: `"Saham Trading" <${process.env.GMAIL_USER}>`,
      to: sendTo,
      subject: subject,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

module.exports = sendEmail;