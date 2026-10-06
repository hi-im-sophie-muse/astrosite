import { useRef, useEffect, useState } from 'preact/hooks';
import type { ComponentChildren } from 'preact';

export default function Desktop({ children }: { children: ComponentChildren }) {
  const drag = useRef<{ el: HTMLElement; dx: number; dy: number } | null>(null);
  const top = useRef(1);
  const [wins, setWins] = useState<{ id:string; title: string }[]>([]);
  const [hidden, setHidden] = useState<string []>([]);

  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>('.window')];
    setWins(els.map((el) => ({
      id: el.id,
      title: el.querySelector('a')?.textContent ?? el.id, 
    })))
  }, []);

  // i'm sorry, what in the fresh hell is wrong with this language??? 
  // endcurly 3(endparenthesis) linebreak, one indent left endcurly comma startbracket endbracket endparenthesis 
  // and the ever load-bearing semi-colon; else: i will throw errors + tantrums, and blind your retinas over it

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

  const show = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.removeAttribute('hidden');
    raise(el);
    setHidden((h) => h.filter((x) => x !== id));
  };


  return (
    <div
      onClick={(e) => {
        const btn = (e.target as HTMLElement).closest('.minbtn');
        const win = winOf(btn);
        if (btn && win) hide(win.id);
      }}
      onPointerDown={(e) => {
        const win = winOf(e.target);
        if (!win) return;
        raise(win);
        if (!(e.target as HTMLElement).closest('.titlebar')) return;
        if ((e.target as HTMLElement).closest('button')) return;
        const { x, y } = pos(win);
        e.preventDefault();
        drag.current = { el: win, dx: e.clientX - x, dy: e.clientY - y };
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (d) moveTo(d.el, e.clientX - d.dx, e.clientY - d.dy);
      }}
      onPointerUp={() => (drag.current = null)}
    >
        {children}
        <nav className="taskbar" aria-label="open windows">
          {wins.map((w) => (
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