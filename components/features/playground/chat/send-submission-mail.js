import { emailTemplate } from "@/components/actions/send-email/email-template";
import { sendEmail } from "@/components/actions/send-email";
import { format } from "date-fns";

export const sendChatCompletionEmail = async ({
  chat_id,
  chat_name,
  workspace_name,
  agent_name,
  submitted_on,
  submission_url,
  recipient_emails,
  // pdf_content,
}) => {
  const formattedDate = format(new Date(submitted_on), "d MMM, yyyy hh:mm a");

  const { subject, html } = emailTemplate({
    chat_id,
    chat_name,
    workspace_name,
    agent_name,
    submitted_on: formattedDate,
    submission_url,
  });

  await sendEmail({
    to: recipient_emails,
    subject,
    html,
  });

  return {
    success: true,
  };
};
