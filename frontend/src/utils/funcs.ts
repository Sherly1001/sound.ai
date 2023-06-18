import { LatLng, LatLngBounds } from 'leaflet';
import { useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

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

export function genPageLinks(page: number, totalPages: number) {
  const prevs = [...Array(page - 1).keys()].map((i) => i + 1);
  const nexts = [...Array(totalPages).keys()].slice(page).map((i) => i + 1);

  if (totalPages < 4) {
    return [prevs, [page], nexts];
  }

  if (prevs.length > 3) prevs.splice(1, prevs.length - 3, 0);
  if (nexts.length > 3) nexts.splice(2, nexts.length - 3, 0);

  return [prevs, [page], nexts];
}

export function useQueries(): [
  URLSearchParams,
  (params: Record<string, string>) => void,
] {
  const location = useLocation();

  const [params, set] = useSearchParams();
  const setParams = useCallback(
    (params: Record<string, string>) => {
      const search = new URLSearchParams(location.search);
      for (let key in params) {
        search.set(key, params[key]);
      }
      set(search);
    },
    [location],
  );

  return [params, setParams];
}
