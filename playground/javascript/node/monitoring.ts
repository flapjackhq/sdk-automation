import { ApiError } from '@flapjack/client-common';
import { monitoringClient } from '@flapjack/monitoring';

const appId = process.env.FLAPJACK_APPLICATION_ID || '**** APP_ID *****';
const apiKey = process.env.FLAPJACK_ADMIN_KEY || '**** MONITORING_KEY *****';

// Init client with appId and apiKey
const client = monitoringClient(appId, apiKey);

async function testMonitoring() {
  try {
    const res = await client.getStatus();

    console.log(`[OK]`, res);
  } catch (e) {
    if (e instanceof ApiError) {
      return console.log(`[${e.status}] ${e.message}`, e.stackTrace, e);
    }

    console.log('[ERROR]', e);
  }
}

testMonitoring();
