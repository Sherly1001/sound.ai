import { LatLng, LatLngBounds } from 'leaflet';

export function getBounds(positions: LatLng[]) {
  if (positions.length < 1) return;

  return positions.slice(1).reduce((acc, i) => {
    acc.extend(i);
    return acc;
  }, new LatLngBounds(positions[0], positions[0]));
}

export function locationToLatLng(location: string) {
  const lo = location.split(',').map(Number);
  return new LatLng(lo[0], lo[1]);
}

export function truncate(
  fullStr: string,
  strLen: number,
  separator: string = '...',
) {
  if (fullStr.length <= strLen) return fullStr;

  let sepLen = separator.length,
    charsToShow = strLen - sepLen,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 2);

  return (
    fullStr.slice(0, frontChars) +
    separator +
    fullStr.slice(fullStr.length - backChars)
  );
}
