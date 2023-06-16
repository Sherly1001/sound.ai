import { Icon } from 'leaflet';
import markerImgShadow from 'leaflet/dist/images/marker-shadow.png';
import redMarkerImg2x from '../assets/red-marker-icon-2x.png';
import redMarkerImg from '../assets/red-marker-icon.png';

export const RED_MARKER = new Icon({
  iconUrl: redMarkerImg,
  iconRetinaUrl: redMarkerImg2x,
  shadowUrl: markerImgShadow,
  iconSize: [25, 41],
  shadowSize: [41, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export const BOUNDS_PAD = 0.2;

export const MAP_TILE_URL =
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const MAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const home = function () {
  return '/';
};

home.records = function (id?: string) {
  return this() + 'records' + (id ? '/' + id : '');
};

home.models = function (id?: string) {
  return this() + 'models' + (id ? '/' + id : '');
};

home.devices = function (id?: string) {
  return this() + 'devices' + (id ? '/' + id : '');
};

home.settings = function () {
  return this() + 'settings';
};

export const links = {
  home,
  login() {
    return '/login';
  },
  register() {
    return '/register';
  },
};
