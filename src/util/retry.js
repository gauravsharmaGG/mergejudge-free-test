// Retry with exponential backoff for flaky downstream calls (payment gateway, carriers).

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function retry(fn, { attempts = 3, baseMs = 50, maxMs = 1000, retryOn = () => true } = {}) {
  let last;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn(i);
    } catch (e) {
      last = e;
      if (i === attempts - 1 || !retryOn(e)) break;
      await sleep(Math.min(maxMs, baseMs * 2 ** i));
    }
  }
  throw last;
}
