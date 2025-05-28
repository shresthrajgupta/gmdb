const Transporter = require("nodemailer").createTransport({
    service: "Gmail",
    secure: true,
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD,
    },
});

async function mailerUtil({ from, to, subject, text }) {
    try {
        let mailOptions = { from, to, subject, text };
        return await Transporter.sendMail(mailOptions);
    } catch (err) {
        console.error(err);
    }
}

module.exports = mailerUtil;