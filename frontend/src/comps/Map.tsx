import { LatLngBounds, LatLngExpression } from 'leaflet';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';

import { BOUNDS_PAD, MAP_ATTRIBUTION, MAP_TILE_URL } from '../utils/const';

import 'leaflet/dist/leaflet.css';

const defaultCenter = {
  lat: 35.68401735486973,
  lng: 139.7668688074273,
};

export interface MapProps {
  children?: ReactNode;
  zoom?: number;
  center?: LatLngExpression;
  bounds?: LatLngBounds;
}

export default function Map({ children, zoom = 12, bounds, center }: MapProps) {
  const [firstLoad, setFirstLoad] = useState(true);

  const MapEvents = useCallback(() => {
    const map = useMapEvents({
      contextmenu(e) {
        if (e.target == map) {
          if (bounds) {
            map.flyToBounds(bounds.pad(BOUNDS_PAD));
          } else if (center) {
            map.flyTo(center);
          }
        }
      },
    });

    useEffect(() => {
      if (firstLoad && map && bounds) {
        map.flyToBounds(bounds.pad(BOUNDS_PAD));
        setFirstLoad(false);
      }
    }, [firstLoad]);

    return <></>;
  }, [bounds]);

  return (
    <MapContainer
      bounds={bounds?.pad(BOUNDS_PAD)}
      center={bounds?.getCenter() ?? center ?? defaultCenter}
      zoom={zoom}
      zoomSnap={0.5}
      style={{
        width: '100%',
        height: '100%',
        outline: 'none',
        border: 'none',
      }}
    >
      <MapEvents />
      <TileLayer attribution={MAP_ATTRIBUTION} url={MAP_TILE_URL} />
      {children}
    </MapContainer>
  );
}
