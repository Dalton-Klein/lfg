require("dotenv").config();
const db = require("../models/index");
const appName = "gangs.gg";
const supportEmail = process.env.EMAIL;
const nodemailer = require("nodemailer");
const express = require("express");
const path = require("path");
const viewPath = path.resolve(__dirname, "./templates/views/");
const partialsPath = path.resolve(__dirname, "./templates/partials");
const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});
const hbs = require("nodemailer-express-handlebars");
transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extName: ".handlebars",
      layoutsDir: viewPath,
      defaultLayout: false,
      partialsDir: partialsPath,
      express,
    },
    viewPath: viewPath,
    extName: ".handlebars",
  })
);

exports.keyGen = (length) => {
  let key = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    key += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return key;
};

exports.checkToken = async (id, token) => {
  let check = await db.userTokens.findOne({ where: { id: id } });
  check = check.dataValues;
  let result = "";
  if (check.id) {
    if (check.token === token) {
      result = true;
    } else result = false;
  } else result = false;
  return result;
};

exports.sendEmail = async (req, vKey, subject, username = "") => {
  if (username != "") {
    username = " " + username;
  }
  const emailSubjects = {
    1: `${appName} sign up verification`,
    2: `${appName} password reset verification`,
    3: `you received a new connection request on ${appName}`,
    4: `your connection request was accepted on ${appName}`,
    5: `you received a new message on ${appName}`,
  };
  const emailBodys = {
    1: `Hello${username}, \n\nThank you for joining ${appName}! Your verification code is: \n\n${vKey} \n\nHappy gaming!`,
    2: `Hello${username}, \n\nA request to change the password for your ${appName} account has been received. \n\nIf this was you, use this code to complete your request: ${vKey} \n\nIf you did not make this request, please contact us at ${supportEmail}. \n\nThank you, \n${appName}`,
    3: `Hello${username}, \n\nYou have received a new connection request! Visit your profile page to review incoming requests: \n\n https://gangs.gg/profile \n\nHappy gaming, \n${appName}`,
  };
  const data = {
    from: `${appName} <${process.env.EMAIL}>`,
    to: `${req.body.email}`,
    subject: `${emailSubjects[subject]}`,
    // text: `${emailBodys[subject]}`,
    template: "general",
    context: {
      username,
      appName,
      vKey,
      supportEmail,
    },
  };
  transporter.sendMail(data, (err, info) => {
    if (err) {
      console.log("error sending email: ", err);
      return;
    } else {
      console.log("email sent: ", info.response);
      return;
    }
  });
};
