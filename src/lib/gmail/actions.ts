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
    'krishinparikh@gmail.com',
    'Someone chatted with your Digital Mind!',
    buildMessage(notionLink)
  );
}

function buildMessage(notionLink: string): string {
  return `
<html>
  <body>
    <h2>New Digital Mind Conversation</h2>
    <p>Someone just had a conversation with your Digital Mind!</p>
    <p><a href="${notionLink}" style="display: inline-block; padding: 10px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">View Conversation in Notion</a></p>
  </body>
</html>
  `;
}