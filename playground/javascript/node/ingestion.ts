import { ApiError } from '@flapjack/client-common';
import { ingestionClient } from '@flapjack/ingestion';

const appId = process.env.FLAPJACK_APPLICATION_ID || '**** APP_ID *****';
const apiKey = process.env.FLAPJACK_ADMIN_KEY || '**** ADMIN_KEY *****';

// Init client with appId and apiKey
const client = ingestionClient(appId, apiKey, 'us', {
  authMode: 'WithinHeaders',
  hosts: [{ url: 'staging-data.us.flapjack.io', accept: 'readWrite', protocol: 'https' }],
});

async function testIngestion() {
  try {
    const res = await client.listAuthentications();

    console.log(`[OK]`, res);
  } catch (e) {
    if (e instanceof ApiError) {
      return console.log(`[${e.status}] ${e.message}`, e.stackTrace, e);
    }

    console.log('[ERROR]', e);
  }
}

testIngestion();
