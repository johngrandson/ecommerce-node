const transporter = require("nodemailer").createTransport(
  require("../config/email")
);
const { api: link } = require("../config");

module.exports = ({ user, recovery }, cb) => {
  const message = `
    <h1 style="text-align: center;">Password Recovery</h1>
    <br />
    <p>
        Here's the link to update your password. Access it and fill up with your new password: 
    </p>
    <a href="${link}/v1/api/user/password-recovered?token=${recovery.token}">
        ${link}/v1/api/user/password-recovered?token=${recovery.token}
    </a>
    <br /><br /><hr />
    <p>
        Warning: If you did not requested this redefinition, just ignore this e-mail.
    </p>
  `;

  const emailOptions = {
    from: "naoresponder@lojati.com",
    to: user.email,
    subject: "Password redefinition - Loja TI",
    html: message,
  };

  if (process.env.NODE_ENV === "production") {
    transporter.sendMail(emailOptions, (error, info) => {
      if (error) {
        console.log(`email error: `, error);
        return cb(
          "Something happened when trying to send an e-mail, try again."
        );
      } else {
        return cb(
          null,
          "Link with password redefinition sent to your e-mail with success."
        );
      }
    });
  } else {
    console.log(`emailOptions: `, emailOptions);
    return cb(
      null,
      "Link with password redefinition sent to your e-mail with success."
    );
  }
};
