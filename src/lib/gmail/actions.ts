'use server'

import { gmail } from './client';

export async function sendEmail(
  recipient: string,
  subject: string,
  body: string
) {
  const message = [
    `To: ${recipient}`,
    `Subject: ${subject}`,
    'Content-Type: text/html; charset=utf-8',
    '',
    body,
  ].join('\n');

  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage,
    },
  });
}

export async function sendNotificationEmail(notionLink: string) {
  await sendEmail(
    'mriduparikh@gmail.com',
    'New Digital Mind Activity',
    buildMessage(notionLink)
  );
}

function buildMessage(notionLink: string): string {
  return `
<html>
  <body>
    <h2>New Digital Mind Activity</h2>
    <p>Someone just chatted with your digital mind! Check it out below:</p>
    <p><a href="${notionLink}" style="display: inline-block; padding: 10px 20px; background-color: #8c5287; color: white; text-decoration: none; border-radius: 5px;">View Conversation in Notion</a></p>
  </body>
</html>
  `;
}