const nodeMailer = require("nodemailer");
const { mailConfig } = require("../config");
const { host, port, info, noreply } = mailConfig;

const mailNoReplyDispatcher = async (options) => {
  try {
    let transporter = nodeMailer.createTransport({
      host,
      port,
      pool: true,
      maxConnections: 20,
      maxMessages: Infinity,
      priority: "high",
      secure: port === 465 ? true : false,
      auth: {
        user: noreply.user,
        pass: noreply.password,
      },
    });
    let result = await transporter.sendMail({
      from: noreply.user,
      subject: options.subject,
      ...options,
    });
    return {
      error: false,
      result,
    };
  } catch (error) {
    // console.log("error mailNoReplyConfig", error);
    return {
      error: true,
      result: error.message,
    };
  }
};

const mailInfoDispatcher = async (options) => {
  try {
    let transporter = nodeMailer.createTransport({
      host,
      port,
      pool: true,
      maxConnections: 1,
      secure: port === 465 ? true : false,
      auth: {
        user: info.user,
        pass: info.password,
      },
    });
    let result = await transporter.sendMail({
      from: info.user,
      subject: options.subject,
      ...options,
    });
    return {
      error: false,
      result,
    };
  } catch (error) {
    // console.log("error mailNoReplyConfig", error);
    return {
      error: true,
      result: error.message,
    };
  }
};

module.exports = {
  mailNoReplyDispatcher,
  mailInfoDispatcher,
};
