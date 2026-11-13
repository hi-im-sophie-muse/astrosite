import { useState } from 'preact/hooks';

const LINES = [
  "omg a dance pardner!! hi i'm clip-pee but you can call me clip-p for short",
  'Requests accepted for more Vinamp songs, contact Sophie.',
  'Feeling bad? Unclench your teeth. Hope this helps!',
  'Unlike Bonzi, I am Legit and Free of viruses :)',
  'i LOVE PAPER',
  'I hate windows, can you open like five of them and then push them off the screen for me? I need to see those windows suffer please and thank you.',
  'Fish love me, women fear me.',
  "u just lost the game lol",
  '(╯°□°）╯︵ ┻━┻',
  '[This page has been intentionally left blank.]',
  '',
];

export default function Clippy() {
  const [n, setN] = useState(-1);

  return (
    <div className="clippy">
      <p className="bubble" role="status">{n >= 0 ? LINES[n] : ''}</p>
      <button type="button" aria-label="clippy: say something" onClick={() => setN((n + 1) % LINES.length)}>
        <img src="/icons/clippy.png" alt="" width="48" height="48" />
      </button>
    </div>
  );
}