import { LatLng, LatLngBounds } from 'leaflet';
import { abs, complex } from 'mathjs';
import { useCallback } from 'react';
import {
  NavigateFunction,
  useLocation,
  useSearchParams,
} from 'react-router-dom';

export function getBounds(positions: LatLng[]) {
  if (positions.length < 2) return;

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

export function dateString(date?: Date) {
  if (!date) return;

  const year = date.getFullYear();
  let month: any = date.getMonth() + 1;
  let day: any = date.getDate();
  let hour: any = date.getHours();
  let minute: any = date.getMinutes();

  if (isNaN(year)) return;

  if (month < 10) month = '0' + month;
  if (day < 10) day = '0' + day;
  if (hour < 10) hour = '0' + hour;
  if (minute < 10) minute = '0' + minute;

  const res = `${year}-${month}-${day}T${hour}:${minute}`;
  return res;
}

export function fftToArr(fft: string) {
  const res = fft
    .split(',')
    .filter((s) => s)
    .map((s) => s.replace('j', 'i'))
    .map((s) => complex(s))
    .map((c) => abs(c))
    .map(Number);

  let pad = res.length - 1;
  while (res[pad] == 0) --pad;
  return res.slice(0, pad + 1);
}

export function storageSetItem<T>(name: string, data: T) {
  localStorage.setItem(name, JSON.stringify(data));
}

export function storageGetItem<T>(name: string): T | undefined {
  const val = localStorage.getItem(name);
  return val ? JSON.parse(val) : undefined;
}

export function storageRemoveItem(name: string) {
  localStorage.removeItem(name);
}

export function historyBack(
  history: string[],
  navigate: NavigateFunction,
  next?: string,
) {
  const prev = history[history.length - 2];

  if (next && (!prev || prev != next)) {
    navigate(next);
  } else {
    navigate(-1);
  }
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
