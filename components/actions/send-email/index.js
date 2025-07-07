"use server";

import nodemailer from "nodemailer";

// ===== EMAIL SENDER CONFIGURATION =====
const emailConfig = {
  host: process.env.SMTP_EMAIL_HOST,
  port: process.env.SMTP_EMAIL_PORT,
  secure: process.env.SMTP_EMAIL_SECURE,
  auth: {
    user: process.env.SMTP_EMAIL_USERNAME,
    pass: process.env.SMTP_EMAIL_PASSWORD,
  },
};

// ===== VALIDATE EMAIL DATA =====
const validateEmailData = (emailData) => {
  const { to, subject, text, html } = emailData;

  if (!to || !to.length) {
    return { valid: false, error: "Recipient email is required" };
  }

  if (!subject) {
    return { valid: false, error: "Email subject is required" };
  }

  if (!text && !html) {
    return { valid: false, error: "Email content is required (text or html)" };
  }

  return { valid: true };
};

// ===== SEND EMAIL =====
export const sendEmail = async (emailData) => {
  const {
    to,
    cc,
    bcc,
    subject,
    text,
    html,
    from = `${process.env.SMTP_EMAIL_FROM_NAME} <${process.env.SMTP_EMAIL_FROM}>`,
    replyTo,
    attachments,
  } = emailData;

  // ===== VALIDATE EMAIL DATA =====
  const validation = validateEmailData(emailData);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // ===== CREATE TRANSPORTER =====
  try {
    const transporter = nodemailer.createTransport(emailConfig);

    // Prepare mail options
    const mailOptions = {
      from,
      to: Array.isArray(to) ? to.join(",") : to,
      subject,
      text,
      html,
    };

    // ===== ADD OPTIONAL FIELDS =====
    if (cc) mailOptions.cc = Array.isArray(cc) ? cc.join(",") : cc;
    if (bcc) mailOptions.bcc = Array.isArray(bcc) ? bcc.join(",") : bcc;
    if (replyTo) mailOptions.replyTo = replyTo;
    if (attachments && Array.isArray(attachments))
      mailOptions.attachments = attachments;

    // ===== SEND EMAIL =====
    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Email send error:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};
