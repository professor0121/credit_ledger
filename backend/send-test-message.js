const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const token = process.env.WA_ACCESS_TOKEN;
const phoneId = process.env.WA_PHONE_NUMBER_ID;
const recipient = "916269880874";
const messageText = "Hello from Credit Ledger! 🎉 Your test message is received and the integration is working perfectly!";

async function sendMessage() {
  const url = `https://graph.facebook.com/v20.0/${phoneId}/messages`;

  console.log(`Sending message to: ${recipient}`);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipient,
        type: "text",
        text: {
          body: messageText
        }
      })
    });

    const data = await res.json();
    console.log('API Response:', JSON.stringify(data, null, 2));

    if (data.messages && data.messages.length > 0) {
      console.log('\nSUCCESS! Message sent successfully.');
      console.log('Message ID:', data.messages[0].id);
    } else if (data.error) {
      console.error('\nFailed to send message:', data.error);
    }
  } catch (err) {
    console.error('Request Error:', err.message);
  }
}

sendMessage();
