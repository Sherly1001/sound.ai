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
