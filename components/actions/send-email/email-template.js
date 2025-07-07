import { format } from "date-fns";

export const emailTemplate = ({
  chat_id,
  chat_name,
  workspace_name,
  agent_name,
  submitted_on,
  submission_url,
}) => {
  // Create a modern HTML template
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Submission Notification</title>
    <!-- Basic CSS for modern and minimal look with black theme -->
    <style type="text/css">
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f7f7f7;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        td {
            padding: 0;
        }
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }
        a {
            text-decoration: none;
            color: #1a1a1a; /* Darker link color */
        }
        .container-table { /* New class for the outer table */
            background-color: #f7f7f7;
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        .inner-container { /* New class for the inner table (max-width container) */
            max-width: 600px;
            margin: 20px auto;
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        .content-block {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
            margin-bottom: 20px;
        }
        .header {
            background-color: #1a1a1a; /* Black header background */
            color: #ffffff;
            text-align: center;
            padding: 20px 0;
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
            font-size: 24px;
            font-weight: bold;
        }
        .text-paragraph { /* New class for paragraphs */
            margin-top: 0;
            margin-bottom: 15px;
        }
        .text-paragraph-bottom { /* New class for paragraphs with less bottom margin */
            margin-top: 5px;
            margin-bottom: 0;
        }
        .heading-3 { /* New class for h3 */
            color: #2c3e50;
            margin-top: 25px;
            margin-bottom: 15px;
        }
        .summary-table-container { /* New container for table styling */
            background-color: #f9f9f9; /* Light background for the table area */
            border-radius: 8px; /* Rounded corners for the table container */
            padding: 15px 20px; /* Padding inside the table container */
            margin-top: 15px; /* Space above the table */
            margin-bottom: 15px; /* Space below the table */
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.05); /* Subtle inner shadow */
        }
        .summary-table {
            width: 100%;
            border-collapse: collapse;
        }
        .summary-table-cell { /* Class for all summary table cells */
            padding: 8px 0;
            vertical-align: top;
            font-size: 15px;
            border-bottom: 1px solid #eeeeee; /* Light border between rows */
        }
        .summary-table-row-last .summary-table-cell { /* No border for the last row */
            border-bottom: none;
        }
        .summary-table-label { /* Class for first column (labels) */
            font-weight: 600;
            padding-right: 15px;
            width: 120px;
            color: #555555;
        }
        .button-wrapper {
            text-align: center;
            padding: 25px 0 10px 0;
        }
        .button {
            display: inline-block;
            background-color: #1a1a1a; /* Black button background */
            color: #ffffff !important;
            padding: 14px 30px;
            border-radius: 8px;
            font-weight: bold;
            text-align: center;
            vertical-align: middle;
            font-size: 17px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4); /* Darker button shadow */
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
            line-height: 1.2;
        }
        .button:hover {
            background-color: #000000; /* Even darker on hover */
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5); /* Enhanced hover shadow */
        }
        .button-subtitle {
            display: block;
            font-size: 0.75em;
            font-weight: normal;
            opacity: 0.9;
            margin-top: 3px;
        }
        .quick-actions {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #1a1a1a;
        }
        .quick-actions h4 {
            margin-top: 0;
            margin-bottom: 15px;
            color: #2c3e50;
            font-size: 16px;
        }
        .quick-actions ol {
            margin: 0;
            padding-left: 20px;
        }
        .quick-actions li {
            margin-bottom: 10px;
            line-height: 1.5;
        }
        .quick-actions ul {
            margin: 5px 0;
            padding-left: 20px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 13px;
            color: #888888;
        }
        .footer-link {
            color: #888888;
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <!-- Main outer table for centering and responsiveness -->
    <table width="100%" cellspacing="0" cellpadding="0" border="0" class="container-table">
        <tr>
            <td align="center">
                <table class="container inner-container" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <!-- Email Header -->
                    <tr>
                        <td align="center" class="header">
                            Gatherly
                        </td>
                    </tr>
                    <!-- Main Content Block -->
                    <tr>
                        <td align="left" class="content-block">
                            <p class="text-paragraph">Hi,</p>
                            <p class="text-paragraph">Great news — a user just completed a submission in your workspace <strong>${workspace_name}</strong>.</p>

                            <h3 class="heading-3">Key Details:</h3>
                            <div class="summary-table-container">
                                <table class="summary-table" width="100%" cellspacing="0" cellpadding="0" border="0">
                                    <tr>
                                        <td class="summary-table-cell summary-table-label">Submission ID:</td>
                                        <td class="summary-table-cell">${chat_id}</td>
                                    </tr>
                                    <tr>
                                        <td class="summary-table-cell summary-table-label">Submitted On:</td>
                                        <td class="summary-table-cell">${format(
                                          new Date(submitted_on),
                                          "d MMM, yyyy hh:mm a"
                                        )}</td>
                                    </tr>
                                    <tr>
                                        <td class="summary-table-cell summary-table-label">Agent Name:</td>
                                        <td class="summary-table-cell">${agent_name}</td>
                                    </tr>
                                    <tr class="summary-table-row-last">
                                        <td class="summary-table-cell summary-table-label">Submission Title:</td>
                                        <td class="summary-table-cell">${chat_name}</td>
                                    </tr>
                                </table>
                            </div>

                        

                            <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td align="center" class="button-wrapper">
                                        <a href="${submission_url}" class="button">
                                            📋 View Full Submission Details
                                            <span class="button-subtitle">(Open in Gatherly)</span>
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p class="text-paragraph-bottom" style="margin-top: 30px;">Best regards,</p>
                            <p class="text-paragraph-bottom">Team Gatherly</p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td align="center" class="footer">
                            <p class="text-paragraph-bottom">This email was sent by Gatherly. &copy; ${new Date().getFullYear()}.</p>
                            <p class="text-paragraph-bottom">If you have any questions, please contact our support team.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `.trim();

  return {
    subject: `✅ New Submission in [${workspace_name}] — ${agent_name}`,
    html,
  };
};
