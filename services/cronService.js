const cron = require('node-cron');
const Booking = require('../models/Booking');
const { transporter } = require('./emailService');
const moment = require('moment-timezone');

// Define the recipient email addresses for the daily report
const ADMIN_EMAILS = [
  'rajkrgorai72@gmail.com',
  'admin2@example. com'
];

const scheduleDailyReport = () => {
  // '5 18 * * *' executes at exactly 18:05 (6:05 PM) every day
  cron.schedule('5 18 * * *', async () => {
    try {
      const currentTime = moment().tz("Asia/Calcutta");
      const todayStart = currentTime.clone().startOf('day').toDate();
      const todayEnd = currentTime.clone().endOf('day').toDate();

      const todaysBookings = await Booking.find({
        bookingDate: { $gte: todayStart,$lte: todayEnd }
      }).populate('userId', 'fullName location contactNumber teamName');

      if (todaysBookings.length === 0) {
        console.log('Cron: No bookings recorded for today. Email skipped.');
        return;
      }

      let reportContent = 'DAILY CAB BOOKING REPORT\n\n';
      reportContent += 'Name | Team | Shift | Type | Location | Contact\n';
      reportContent += '-----------------------------------------------------------------\n';

      todaysBookings.forEach(b => {
        if (b.userId) {
          reportContent += `${b.userId.fullName} | ${b.userId.teamName} | ${b.shift} | ${b.type} | ${b.userId.location} | ${b.userId.contactNumber}\n`;
        }
      });

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: ADMIN_EMAILS.join(', '),
        subject: `Daily Cab Booking Report - ${currentTime.format('YYYY-MM-DD')}`,
        text: reportContent
      };

      await transporter.sendMail(mailOptions);
      console.log('Cron: Daily report compiled and sent successfully at 6:05 PM.');
    } catch (error) {
      console.error('Cron Error: Failed to generate or send daily report:', error);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Calcutta"
  });
};

module.exports = { scheduleDailyReport };