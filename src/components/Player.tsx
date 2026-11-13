import { useEffect, useRef, useState } from 'preact/hooks';

type Track = { title: string; src: string; work: string };

export default function Player({ tracks }: { tracks: Track[] }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [i, setI] = useState(0);
  const [on, setOn] = useState(false);

  const load = (n: number) => {
    const el = audio.current;
    if (!el) return;
    el.src = tracks[n].src;
    el.dataset.title = tracks[n].title;
    setI(n);
  };

  useEffect(() => {
    if (tracks.length > 0) load(0);
  }, []);

  const go = (n: number) => {
    load((n + tracks.length) % tracks.length);
    audio.current?.play().catch(() => {});
  };

  const toggle = () => {
    const el = audio.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  };

  if (tracks.length === 0) return <p>No tracks online yet.</p>;

  return (
    <div className="winamp" data-on={on ? 'yes' : 'no'}>
      <div className="screen">
        <p className="track">{i + 1}. {tracks[i].title}</p>
        <p className="spectrum" aria-hidden="true">
          <span /><span /><span /><span /><span /><span /><span /><span />
        </p>
      </div>
      <audio
        ref={audio}
        controls
        preload="none"
        onPlay={() => {
          setOn(true);
          document.documentElement.dataset.clippy = 'on';
        }}
        onPause={() => setOn(false)}
        onEnded={() => go(i + 1)}
      />
      <p className="buttons">
        <button type="button" aria-label="previous" onClick={() => go(i - 1)}>|◀</button>
        <button type="button" aria-label={on ? 'pause' : 'play'} onClick={toggle}>{on ? '❚❚' : '▶'}</button>
        <button type="button" aria-label="next" onClick={() => go(i + 1)}>▶|</button>
      </p>
      <ol className="playlist">
        {tracks.map((t, n) => (
          <li key={n}>
            <button type="button" aria-current={n === i ? 'true' : undefined} onClick={() => go(n)}>
              {t.title} <small>{t.work}</small>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}