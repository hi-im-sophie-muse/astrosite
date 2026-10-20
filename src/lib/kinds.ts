export const schemaTypeFor: Record<string, string> = {
  album: 'MusicAlbum',
  game: 'VideoGame',
  concert: 'MusicEvent',
};

export const labelFor: Record<string, string> = {
  single: '',
  album: 'album',
};

export const iconFor = (data: { icon?: string; kind: string }) =>
  '/icons/' + (data.icon ?? 'kind-' + data.kind) + '.png';