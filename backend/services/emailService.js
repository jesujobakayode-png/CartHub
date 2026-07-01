import resend from "../config/resend.js";

import welcomeEmail from "../templates/welcomeEmail.js";

import verificationEmail from "../templates/verificationEmail.js";

function getMailer() {
  if (!resend) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  if (!process.env.EMAIL_FROM) {
    throw new Error("EMAIL_FROM is not configured");
  }

  return resend;
}

function getFrontendURL() {
  if (!process.env.FRONTEND_URL) {
    throw new Error("FRONTEND_URL is not configured");
  }

  return process.env.FRONTEND_URL.replace(/\/$/, "");
}

export const sendVerificationEmail = async (
  email,
  name,
  token
) => {

  const verificationLink =
    `${getFrontendURL()}/verify-email?token=${token}`;

  await getMailer().emails.send({

    from: process.env.EMAIL_FROM,

    to: email,

    subject: "Verify your CartHub account",

    html: verificationEmail(
      name,
      verificationLink
    ),

  });

};

export const sendWelcomeEmail = async (
  email,
  name
) => {

  try {

    await getMailer().emails.send({

      from: process.env.EMAIL_FROM,

      to: email,

      subject: "Welcome to CartHub",

      html: welcomeEmail(name),

    });

    console.log("Welcome email sent");

  } catch (error) {

    console.log(error);

  }

};
