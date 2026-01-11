import 'dotenv/config';
import { sendNotificationEmail } from '../lib/gmail/actions';

async function test() {
  try {
    console.log('Sending test email...');
    await sendNotificationEmail('https://www.notion.so/test-page');
    console.log('✅ Email sent successfully!');
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}

test();
