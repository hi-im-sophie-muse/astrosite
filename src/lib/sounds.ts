export const play = (name: string) => {
  if (document.documentElement.dataset.sound !== 'on') return;
  new Audio('/sounds/' + name + '.mp3').play().catch(() => {});
};