const nodemailer = require("nodemailer");
const ejs = require("ejs");
const pdf = require("html-pdf");
const { emailUser, emailPass } = require("./config");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

const sendBookingEmail = async (booking, isUpdate = false) => {
  try {
    // Render the HTML template with EJS
    const html = await ejs.renderFile("./views/booking.ejs", { booking, isUpdate });
    const buffer = await generatePdf(html);

    const mailOptions = {
      from: emailUser,
      to: "gustywarrior2003@gmail.com",
      subject: isUpdate ? "Updated Booking Confirmation" : "Booking Confirmation",
      html: `
          <div style="font-family: 'Arial', sans-serif; color: #333;">
            <h2 style="font-size: 20px; font-weight: bold;">${isUpdate ? "Updated Booking Details" : "Booking Details"}</h2>
            <p style="font-size: 14px; margin: 0;">
              <strong>Boarding Pass Number:</strong> ${booking.boardingpassnumber}<br>
              <strong>Flight Number:</strong> ${booking.flightNumber}<br>
              <strong>Passenger Name:</strong> ${booking.passengerName}<br>
              <strong>Departure Date:</strong> ${booking.departureDate}<br>
              <strong>Seat Number:</strong> ${booking.seatNumber}<br>
              <strong>From:</strong> ${booking.fromLocation}<br>
              <strong>To:</strong> ${booking.toLocation}
            </p>
          </div>
        `,
      attachments: [
        {
          filename: "Booking.pdf",
          content: buffer,
          contentType: "application/pdf",
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log("Error sending email:", error);
      } else
        console.log("Email sent: " + info.response);
    });
    ;
  } catch (error) {
    console.error("Error:", error);
  }
};

const generatePdf = async (html) => {
  return new Promise((resolve, reject) => {
    pdf.create(html).toBuffer((err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
};

module.exports = sendBookingEmail;
