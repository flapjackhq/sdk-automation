import { ApiError } from '@flapjack/client-common';
import { compositionClient } from '@flapjack/composition';

const appId = process.env.METIS_APPLICATION_ID || '**** APP_ID *****';
const apiKey = process.env.METIS_API_KEY || '**** ADMIN_KEY *****';

// Init client with appId and apiKey
const client = compositionClient(appId, apiKey);

async function testComposition() {
  try {
    console.log(appId, apiKey);

    console.log(await client.search({ compositionID: 'id1', requestBody: {} }));
  } catch (e) {
    if (e instanceof ApiError) {
      return console.log(`[${e.status}] ${e.message}`, e.stackTrace, e);
    }

    console.log('[ERROR]', e);
  }
}

testComposition();
