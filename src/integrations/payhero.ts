/** PayHero integration — placeholder for future M-Pesa / payments wiring. */
export function getPayHeroDocsUrl() {
  return 'https://payhero.co.ke';
}

export async function pushPayHeroWebhookSample(): Promise<{ ok: false; message: string }> {
  return { ok: false, message: 'PayHero webhook bridge is not enabled in this demo build.' };
}
