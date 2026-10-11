const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_APP_PASSWORD
  }
});

const sendOTP = async (targetEmail, otpCode) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: targetEmail,
    subject: 'Cab Booking Portal - Verification Code',
    text: `Your one-time password for registration is: ${otpCode}.\n\nThis code expires in 10 minutes.`
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTP, transporter };