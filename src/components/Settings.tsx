import { useEffect, useState } from 'preact/hooks';
import { play } from '../lib/sounds';

export default function Settings() {
  const [now, setNow] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    setNow({ ...document.documentElement.dataset });
  }, []);

  const pick = (name: string, value: string) => {
    document.documentElement.dataset[name] = value;
    try {
      localStorage.setItem('desktop-' + name, value);
    } catch {}
    setNow((n) => ({ ...n, [name]: value }));
    if (name === 'sound' && value === 'on') play('chime');
  };

  return (
    <form className="settings" onSubmit={(e) => e.preventDefault()}>
      <fieldset>
        <legend>Theme</legend>
        <label><input type="radio" name="theme" checked={!now.theme} onChange={() => pick('theme', '')} /> Day</label>
        <label><input type="radio" name="theme" checked={now.theme === 'night'} onChange={() => pick('theme', 'night')} /> Night</label>
        <label><input type="radio" name="theme" checked={now.theme === 'black'} onChange={() => pick('theme', 'black')} /> Black</label>
      </fieldset>
      <fieldset>
        <legend>Sound and motion</legend>
        <label><input type="checkbox" checked={now.sound === 'on'} onChange={(e) => pick('sound', e.currentTarget.checked ? 'on' : '')} /> Sound effects</label>
        <label><input type="checkbox" checked={now.motion === 'still'} onChange={(e) => pick('motion', e.currentTarget.checked ? 'still' : '')} /> Hold still</label>
      </fieldset>
    </form>
  );
}