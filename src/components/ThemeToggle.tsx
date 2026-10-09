export default function ThemeToggle() {
  const flip = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === 'night' ? '' : 'night';
    root.dataset.theme = next;
    try {
      localStorage.setItem('desktop-theme', next);
    } catch {}
  };

  return (
    <button type="button" className="themebtn" onClick={flip}>
      theme
    </button>
  );
}