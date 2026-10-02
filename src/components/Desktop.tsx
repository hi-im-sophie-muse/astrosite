import { useRef } from 'preact/hooks';
import type { ComponentChildren } from 'preact';

export default function Desktop({ children }: { children: ComponentChildren }) {
  const drag = useRef<{ el: HTMLElement; dx: number; dy: number } | null>(null);
  const top = useRef(1);

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
    el.style.zIndex = String(++top.current);
  };

  return (
    <div
      onPointerDown={(e) => {
        const win = winOf(e.target);
        if (!win) return;
        raise(win);
        if (!(e.target as HTMLElement).closest('.titlebar')) return;
        const { x, y } = pos(win);
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
    </div>
  );
}