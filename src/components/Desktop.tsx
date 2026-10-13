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

  

  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>('.window')];
    setWins(els.map((el) => ({
      id: el.id,
      title: el.querySelector('a')?.textContent ?? el.id, 
    })))
  }, []);
  
  // i'm sorry, what in the fresh hell is wrong with this language??? 
  // endcurly 3(endparenthesis) linebreak, one indent left endcurly comma startbracket endbracket endparenthesis 
  // and the ever load-bearing semi-colon; else if: i will throw errors + tantrums, and blind your retinas over it

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
    el.style.position = 'relative';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
  };

  const raise = (el: HTMLElement) => {
    el.style.position = 'relative';
    el.style.zIndex = String(++top.current);
  };
  
  const hide = (id: string) => {
    document.getElementById(id)?.setAttribute('hidden', '');
    setHidden((h) => (h.includes(id) ? h : [...h, id]));
  };

  const closeWin = (id: string) => {
    document.getElementById(id)?.setAttribute('hidden', '');
    setClosed((h) => (h.includes(id) ? h : [...h, id]));
  };

  const show = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.removeAttribute('hidden');
    raise(el);
    setHidden((h) => h.filter((x) => x !== id));
    setClosed((c) => c.filter((x) => x !== id));
  };

  const home = useRef(new WeakMap<HTMLElement, { x: number; y: number}>());

  const NUDGE: Record<string, [number, number]> = {
    ArrowLeft: [-8, 0],
    ArrowRight: [8 , 0],
    ArrowUp: [0, -8],
    ArrowDown: [0, 8],
  };

  const toggleMax = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('maxed');
  raise(el);
};
  return (
    <div
      onClick={(e) => {
        const t = e.target as HTMLElement;
        const icon = (e.target as HTMLElement).closest('a.icon') as HTMLAnchorElement | null;
        if (icon) {
          show(icon.hash.slice(1));
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
        if (win.classList.contains('maxed')) return;
        const { x, y } = pos(win);
        e.preventDefault();
        drag.current = { el: win, dx: e.clientX - x, dy: e.clientY - y };
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (d) moveTo(d.el, e.clientX - d.dx, e.clientY - d.dy);
      }}
      onPointerUp={() => {
        const d = drag.current; 
        if (d) home.current.set(d.el, pos(d.el));
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
        // console.log('key', e.key, document.activeElement);
        if (e.key === 'F6'|| e.key === "j" || e.key === "J") {
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
        </nav>
    </div>
  );
}