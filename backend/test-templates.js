const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const token = process.env.WA_ACCESS_TOKEN;
const wabaId = process.env.WA_BUSINESS_ACCOUNT_ID;
const phoneId = process.env.WA_PHONE_NUMBER_ID;

console.log('=== WhatsApp Configuration ===');
console.log('Phone Number ID:', phoneId);
console.log('WABA ID:        ', wabaId);
console.log('Token Present:  ', Boolean(token));

async function fetchTemplates() {
  if (!wabaId || !token) {
    console.error('Error: WA_BUSINESS_ACCOUNT_ID or WA_ACCESS_TOKEN is missing in .env');
    return;
  }

  const url = `https://graph.facebook.com/v20.0/${wabaId}/message_templates?limit=100`;
  console.log(`\nFetching templates from: ${url} ...\n`);

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (data.error) {
      console.error('API Error:', JSON.stringify(data.error, null, 2));
      return;
    }

    const templates = data.data || [];
    console.log(`Found ${templates.length} template(s):\n`);

    templates.forEach((tpl, idx) => {
      console.log(`[${idx + 1}] Name:     ${tpl.name}`);
      console.log(`    Status:   ${tpl.status}`);
      console.log(`    Category: ${tpl.category}`);
      console.log(`    Language: ${tpl.language}`);
      console.log(`    ID:       ${tpl.id}`);
      if (tpl.components && tpl.components.length > 0) {
        console.log('    Components:');
        tpl.components.forEach(comp => {
          console.log(`      - Type: ${comp.type}`);
          if (comp.text) console.log(`        Text: "${comp.text.replace(/\n/g, ' ')}"`);
          if (comp.format) console.log(`        Format: ${comp.format}`);
          if (comp.buttons) console.log(`        Buttons: ${JSON.stringify(comp.buttons)}`);
          if (comp.example) console.log(`        Example: ${JSON.stringify(comp.example)}`);
        });
      }
      console.log('-'.repeat(50));
    });

    // Save full JSON output for inspection
    const outputPath = path.join(__dirname, 'templates-output.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`\nFull templates JSON saved to: ${outputPath}`);

  } catch (err) {
    console.error('Request failed:', err.message);
  }
}

fetchTemplates();
