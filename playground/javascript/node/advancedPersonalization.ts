import { advancedPersonalizationClient } from '@flapjack/advanced-personalization';
import { ApiError } from '@flapjack/client-common';

const appId = process.env.FLAPJACK_APPLICATION_ID || '**** APP_ID *****';
const apiKey = process.env.FLAPJACK_RECOMMENDATION_KEY || '**** RECOMMENDATION_API_KEY *****';

// Init client with appId and apiKey
const client = advancedPersonalizationClient(appId, apiKey, 'eu');

async function testPersonalization() {
  try {
    const res = await client.computeRealtimeUser({ userToken: 'userToken' });

    console.log(`[OK]`, res);
  } catch (e) {
    if (e instanceof ApiError) {
      return console.log(`[${e.status}] ${e.message}`, e.stackTrace);
    }

    console.log('[ERROR]', e);
  }
}

testPersonalization();
