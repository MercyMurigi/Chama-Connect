/** Nobuk integration — placeholder for future API wiring. */
export function getNobukConnectUrl() {
  return 'https://nobuk.app';
}

export async function syncNobukLedger(): Promise<{ ok: false; message: string }> {
  return { ok: false, message: 'Nobuk sync is not enabled in this demo build.' };
}
