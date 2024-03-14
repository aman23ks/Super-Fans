import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import ENV from "../config.js";

// http://ethereal.mail/create
let nodeConfig = {
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: ENV.EMAIL,
    pass: ENV.PASSWORD,
  },
  tls: { rejectUnauthorized: false }
};

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js",
  },
});

/** POST: http://localhost:8080/api/registerMail
 * @param: {
 * "username": "example123",
 * "userEmail": "admin123@gmail.com",
 * "text": "",
 * "subject": ""
 * }
 */
export const registerMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body;

  // body of the email
  var email = {
    body: {
      name: username,
      intro:
        text ||
        "Welcome to SuperFans! We're very excited to have you on board.",
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  var emailBody = MailGenerator.generate(email);

  let message = {
    from: ENV.EMAIL,
    to: userEmail,
    subject: subject || "Sign up Successful!",
    html: emailBody,
  };

  // send mail
  try {
    await transporter.sendMail(message);
    return res.status(200).send({ msg: 'You should receive an email from us.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send({ error: 'An error occurred while sending the email.' });
  }
};
