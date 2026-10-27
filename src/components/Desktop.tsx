import { useRef, useEffect, useState } from 'preact/hooks';
import type { ComponentChildren } from 'preact';

export default function Desktop({ children }: { children: ComponentChildren }) {
  const drag = useRef<{ el: HTMLElement; dx: number; dy: number } | null>(null);
  const top = useRef(1);
  const [wins, setWins] = useState<{ id:string; title: string }[]>([]);
  const [hidden, setHidden] = useState<string []>([]);
  const [closed, setClosed] = useState<string[]>([]);
  const [startOpen, setStartOpen] = useState(false);
  const startBtn = useRef<HTMLButtonElement>(null);
  const [msg, setMsg] = useState('');
  const [playing, setPlaying] = useState('');
  const titleOf = (id: string) => wins.find((w) => w.id === id)?.title ?? id;
  const CAP = 16;
  const wide = () => matchMedia('(min-width: 48rem)').matches;
  const fullBox = useRef<HTMLDialogElement>(null);
  const denied = useRef<HTMLDialogElement>(null);
  const leaving = useRef(false);
  const party = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>('.window')];
    setWins(els.map((el) => ({
      id: el.id,
      title: el.querySelector('a')?.textContent ?? el.id, 
    })));
    // i'm sorry, what in the fresh hell is wrong with this language??? 
    // endcurly 3(endparenthesis) linebreak, one indent left endcurly comma startbracket endbracket endparenthesis
    // and the ever load-bearing semi-colon; else if: i will throw errors + tantrums, and blind your retinas over it 

    const saved = load();
    for (const [id, p] of Object.entries<{ x: number; y: number }>(saved.pos ?? {})) {
      const el = document.getElementById(id);
      if (el) moveTo(el, Math.min(p.x, innerWidth - 160), Math.min(p.y, innerHeight - 120));
    }
    for (const id of saved.maxed ?? []) {
      document.getElementById(id)?.classList.add('maxed');
    }
    const ids = els.map((el) => el.id);
    const open: string[] = [];
    // "welcome lines"
    if (saved.welcome !== false) open.push('welcome');
    const again = document.getElementById('welcome-again') as HTMLInputElement | null;
    if (again) again.checked = saved.welcome !== false;
        const last = ids.includes(saved.last) ? saved.last : null;
    if (last) open.push(last);
    const minimized: string[] = last
      ? []
        : (saved.hidden ?? []).filter((id: string) => ids.includes(id)).slice(-3);
    for (const el of els) el.hidden = !open.includes(el.id);
    for (const el of els) if (open.includes(el.id)) place(el);
    setHidden(minimized);
    setClosed(ids.filter((id) => !open.includes(id) && !minimized.includes(id)));
    save({ hidden: minimized });
  }, []);

    useEffect(() => {
    const onLeave = () => {
            if (leaving.current) return;
      const open = [...document.querySelectorAll<HTMLElement>('.window:not([hidden]):not(.maxed)')];
      open.sort((a, b) => Number(b.style.zIndex || 0) - Number(a.style.zIndex || 0));
      save({ last: open[0]?.id ?? null });
    };
    window.addEventListener('pagehide', onLeave);
    return () => window.removeEventListener('pagehide', onLeave);
  }, []);
  
// uE2: start menu
  useEffect(() => {
  if (!startOpen) return;
  const onDown = (e: PointerEvent) => {
    if (!(e.target as HTMLElement).closest('.start')) setStartOpen(false);
  };
  document.addEventListener('pointerdown', onDown);
  return () => document.removeEventListener('pointerdown', onDown);
}, [startOpen]);



  const winOf = (t: EventTarget | null) =>
    (t as HTMLElement | null)?.closest?.('.window') as HTMLElement | null;

  const pos = (el: HTMLElement) => ({
    x: parseFloat(el.style.left || '0'),
    y: parseFloat(el.style.top || '0'),
  });

  const moveTo = (el: HTMLElement, x: number, y: number) => {
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    const pageTop = el.getBoundingClientRect().top + window.scrollY;
      if (pageTop < 0) el.style.top = (y - pageTop) + 'px';
    const pageLeft = el.getBoundingClientRect().left + window.scrollX;
      if (pageLeft < 0) el.style.left = (x - pageLeft) + 'px';
    // const pageRight = el.getBoundingClientRect().right + window.scrollX;
    //  if (pageRight < 0) el.style.right = (x - pageRight) + 'px';
    // I would fix this if it actually got deployed but why would I when I see these magical symbols (//)
  };

  const place = (el: HTMLElement) => {
    if (el.style.left) return;
    const n = top.current % 10;
    moveTo(el, 128 + n * 24, 24 + n * 24);
  };

  const raise = (el: HTMLElement) => {
    el.style.zIndex = String(++top.current);
  };
  
  const hide = (id: string) => {
    document.getElementById(id)?.setAttribute('hidden', '');
    const next = hidden.includes(id) ? hidden : [...hidden, id];
    setHidden(next);
    save({ hidden: next });
    setMsg(titleOf(id) + ' minimized');
  };

  const closeWin = (id: string) => {
    document.getElementById(id)?.setAttribute('hidden', '');
    setClosed((h) => (h.includes(id) ? h : [...h, id]));
  };

  const show = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
        if (closed.includes(id) && wins.length - closed.length >= CAP) {
      fullBox.current?.showModal();
      return;
    }
    el.removeAttribute('hidden');
    place(el);
    raise(el);
        if (!wide()) {
      document.querySelector('.icons')?.after(el);
      el.scrollIntoView();
    }
    const nextHidden = hidden.filter((x) => x !== id);
    const nextClosed = closed.filter((x) => x !== id);
    setHidden(nextHidden);
    setClosed(nextClosed);
    save({ hidden: nextHidden, closed: nextClosed });
  };

  const toggleMax = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const on = el.classList.toggle('maxed');
    raise(el);
    const maxed = [...document.querySelectorAll('.window.maxed')].map((m) => m.id);
    save({ maxed });
    setMsg(titleOf(id) + (on ? ' maximized' : ' back to its size'));
  };

  const home = useRef(new WeakMap<HTMLElement, { x: number; y: number}>());

  const KEY = 'desktop:v1';

  const load = () => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '{}');
    } catch {
      return {};
    }
  };

  const save = (patch: object) => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ ...load(), ...patch }));
    } catch {}
  };

    const restore = () => {
    leaving.current = true;
    try {
      localStorage.removeItem(KEY);
    } catch {}
    location.reload();
  };

  const savePos = (el: HTMLElement) => {
    save({ pos: { ...load().pos, [el.id]: pos(el) } });
  };

  const NUDGE: Record<string, [number, number]> = {
    ArrowLeft: [-8, 0],
    ArrowRight: [8 , 0],
    ArrowUp: [0, -8],
    ArrowDown: [0, 8],
  };

  return (
    <div
      onChange={(e) => {
        const t = e.target as HTMLInputElement;
        if (t.id === 'welcome-again') save({ welcome: t.checked });
      }}
      onPlayCapture={(e) => {
        const track = e.target as HTMLAudioElement;
        for (const other of document.querySelectorAll('audio')) {
          if (other !==track) other.pause();  
          setPlaying(track.dataset.title ?? '');
      }
      }}
      onPauseCapture={() => {
        const still = [...document.querySelectorAll('audio')].some((a) => !a.paused);
        if (!still) setPlaying ('');
      }}
      onClick={(e) => {
        const t = e.target as HTMLElement;
        const icon = (e.target as HTMLElement).closest('a.icon') as HTMLAnchorElement | null;
        if (icon) {
          show(icon.hash.slice(1));
          return;
        }
        const view = t.closest<HTMLElement>('[data-view]');
        if (view) {
          view.closest('.folder')?.setAttribute('data-show', view.dataset.view ?? 'list');
          return;
        }
        // const btn = (e.target as HTMLElement).closest('.minbtn');
        // const win = winOf(btn);
        // if (btn && win) hide(win.id);
          const win = winOf(t);
        if (!win) return;
        if (t.closest('.minbtn')) hide(win.id);
        else if (t.closest('.closebtn')) closeWin(win.id);
        else if (t.closest('.maxbtn')) toggleMax(win.id);
      }}
      onPointerDown={(e) => {
        const win = winOf(e.target);
        if (!win) return;
        raise(win);
        if (!(e.target as HTMLElement).closest('.titlebar')) return;
        if ((e.target as HTMLElement).closest('button')) return;
        if ((e.target as HTMLElement).closest('a')) return;
        if (win.classList.contains('maxed')) return;
        const { x, y } = pos(win);
        e.preventDefault();
        (e.target as HTMLElement).closest<HTMLElement>('.titlebar')?.focus();
        drag.current = { el: win, dx: e.clientX - x, dy: e.clientY - y };
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (d) moveTo(d.el, e.clientX - d.dx, e.clientY - d.dy);
      }}
      onPointerUp={() => {
        const d = drag.current; 
          if (d) {
          home.current.set(d.el, pos(d.el));
          savePos(d.el);
        const gone = [...document.querySelectorAll<HTMLElement>('.window:not([hidden])')].filter((w) => {
          const r = w.getBoundingClientRect();
          return r.left >= innerWidth || r.top >= innerHeight;
        });
        if (gone.length === 5) party.current?.showModal();
        }
        drag.current = null;
      }}
      onFocusCapture={(e) => {
        const win = winOf(e.target);
        if (!win) return;
        raise(win);
        if (!home.current.has(win)) home.current.set(win, pos(win));
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && startOpen) {
          setStartOpen(false);
          startBtn.current?.focus();
          return;
        }
        console.log('key', e.key, document.activeElement);
        
        if (e.key === 'F6') {
            e.preventDefault();
            // console.log('heard')
            const bars = [
              ...(e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>(
                  '.window:not([hidden]) .titlebar',
              ),
            ];
  const current = (e.target as HTMLElement).closest?.('.titlebar');
  const i = bars.indexOf(current as HTMLElement);
  bars[(i + 1) % bars.length]?.focus();
  return;
}
      const bar = (e.target as HTMLElement).closest?.('.titlebar');
      const win = winOf(bar);
      if (!bar || !win) return;
      if (NUDGE[e.key]) {
        e.preventDefault();
        const [dx, dy] = NUDGE[e.key];
        const { x, y } = pos(win);
        moveTo(win, x + dx, y + dy); 
      } else if (e.key === 'Enter') {
        home.current.set(win, pos(win));
      } else if (e.key === 'Escape') {
        const h = home.current.get(win);
        if (h) moveTo(win, h.x, h.y);
      }
    }}
    >
      <p className="announcer" role="status" aria-live="polite">{msg}</p>
            <dialog ref={fullBox} className="alert">
        <p>There is not enough memory to open another window. Close one or more windows, and then try again.</p>
        <form method="dialog">
          <button>OK</button>
        </form>
      </dialog>
            <dialog ref={denied} className="alert">
        <p>Cannot restore the default desktop: Access is denied. Try again?</p>
        <form method="dialog">
          <button type="button" onClick={restore}>Retry</button>
          <button>Cancel</button>
        </form>
      </dialog>
            <dialog ref={party} className="alert">
        <p>YOU'RE WINNER !</p><p style="text-align: center;">🏆</p>
        <form method="dialog">
          <button>OK</button><button><a href="https://youtu.be/feNk7qsU2lY?si=vluIFYKCagFMDGYJ&t=54" target="_blank">NEVER LOSE</a></button>
        </form>
      </dialog>
        {children}
        <nav className="taskbar" aria-label="open windows">
          <span className="start">
            <button
              type="button"
              ref={startBtn}
              aria-expanded={startOpen}
              onClick={() => setStartOpen((o) => !o)}
            >
              start
            </button>
            {startOpen && (
              <ul className="startmenu">
                {wins.map((w) => (
                  <li key={w.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setStartOpen(false);
                        show(w.id);
                      }}
                    >
                      {w.title}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setStartOpen(false);
                      denied.current?.showModal();
                    }}
                  >
                    Restore Default Desktop
                  </button>
                </li>
              </ul>
            )}
          </span>
          {wins.filter((w) => !closed.includes(w.id)).map((w) => (
            <button
              key={w.id}
              type="button"
              aria-pressed={!hidden.includes(w.id)}
              onClick={() => (hidden.includes(w.id) ? show(w.id) : hide(w.id))}
            >
              {w.title}
            </button>
          ))}
          {playing && (
            <span className="nowplaying" role="status">
              <span>♪ {playing}</span>
            </span>
          )} {/* Interesting choice of placement but okay */}
        </nav>
    </div>
  );
}