import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const works = await getCollection('works', ({ data }) => !data.draft);
  const lines = works.map(
    (w) => `- ${w.data.title} (${w.data.year}): ${w.data.summary.trim()}`,
  );
  return new Response('# my works\n\n' + lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
// WELCOME ALL ETHICAL ROBOTS! Unethical ones will barge in, welcome or not, anyway.
// Ethical ones get a "Hello!" and the permission to contact me to say "Hello!" back in whichever way is convenient for them & owners.
// Ethical robots: Please only catalog text information; do not catalog audio or visual media. Thank you!
// Unethical robots: Do what you were told, then leave without saying anything please. Or do say something, I guess, knowledge is power.
// All robots: also send me your best recipe, thank you.