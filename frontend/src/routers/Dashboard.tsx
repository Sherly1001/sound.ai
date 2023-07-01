import {
  faFloppyDisk,
  faList,
  faSquarePollVertical,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { facDeepLearning } from '../custom-icons';

import { Box, Grid, HStack, Text, VStack } from '@chakra-ui/react';
import { Marker as LMarker } from 'leaflet';
import { useCallback, useEffect, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { routes } from '.';
import ImgZoom from '../comps/ImgZoom';
import Link from '../comps/Link';
import Loading from '../comps/Loading';
import Map from '../comps/Map';
import RecordInfo from '../comps/RecordInfo';
import Rounded from '../comps/Rounded';
import { dashboardService } from '../services';
import { StatisticDto } from '../types';
import { API_URL, BLUE_MARKER, RED_MARKER } from '../utils/const';
import { getBounds, locationToLatLng } from '../utils/funcs';

const stas = ([newRecords, numDevices, numModels, percentOk]: number[]) => [
  {
    name: 'New Records',
    value: newRecords,
    icon: faList,
    link: routes.home.records,
  },
  {
    name: 'Devices',
    value: numDevices,
    icon: faFloppyDisk,
    link: routes.home.devices,
  },
  {
    name: 'Models',
    value: numModels,
    icon: facDeepLearning,
    link: routes.home.models,
  },
  {
    name: 'Percent OK',
    value: percentOk.toFixed(4) + '%',
    icon: faSquarePollVertical,
    link: routes.home,
  },
];

export default function Dashboard() {
  const [currentData, setCurrentData] = useState(0);
  const [statistic, setStatistic] = useState<StatisticDto>();

  useEffect(() => {
    document.title = 'Dashboard';
  }, []);

  const getData = useCallback(
    () =>
      dashboardService
        .statistic()
        .then((res) => res.data)
        .catch((err) => (console.debug(err), undefined)),
    [],
  );

  return (
    <Loading getData={getData} setData={setStatistic}>
      {statistic && (
        <Box padding="5">
          <Grid
            templateColumns="repeat(12, 1fr)"
            gap={{ base: '5', xl: '6', '2xl': '8' }}
          >
            {stas([
              statistic.newRecords ?? 0,
              statistic.numDevices ?? 0,
              statistic.numModels ?? 0,
              statistic.percentOk ?? 0,
            ]).map((st, idx) => (
              <Rounded
                key={idx}
                flex="1"
                padding="5"
                gridColumn={{ base: 'span 6', md: 'span 3' }}
              >
                <Link to={st.link}>
                  <HStack>
                    <Box background="background" padding="3" borderRadius="5">
                      <FontAwesomeIcon icon={st.icon} fontSize="24" />
                    </Box>
                    <VStack alignItems="start" spacing="0">
                      <Text color="cyan.700">{st.name}</Text>
                      <Text color="black" fontSize="xl" fontWeight="bold">
                        {st.value}
                      </Text>
                    </VStack>
                  </HStack>
                </Link>
              </Rounded>
            ))}
            <Rounded
              height="65vh"
              padding="2"
              gridColumn={{ base: 'span 12', md: 'span 8', xl: 'span 9' }}
            >
              <Map
                bounds={getBounds(
                  statistic.records.map((dt) => locationToLatLng(dt.location)),
                )}
                center={
                  statistic.records[0]?.location
                    ? locationToLatLng(statistic.records[0]?.location)
                    : undefined
                }
              >
                {statistic.records.map((dt, idx) => (
                  <Marker
                    key={idx}
                    position={locationToLatLng(dt.location)}
                    icon={idx == currentData ? RED_MARKER : BLUE_MARKER}
                    eventHandlers={{
                      popupopen(_e) {
                        setCurrentData(idx);
                      },
                      add(e) {
                        if (idx == 0) {
                          const marker = e.target as LMarker;
                          const pop = marker.getPopup();
                          if (!pop?.isOpen()) {
                            pop?.toggle();
                          }
                        }
                      },
                    }}
                  >
                    <Popup>
                      <Box>
                        <ImgZoom
                          src={API_URL + '/record/images/' + dt.imageFilePath}
                          width="52"
                          zoomScale={4}
                          transitionTime={0.3}
                        />
                        <Text as="div" marginY="2">
                          Temperature: {dt.temperature ?? 0} °C
                        </Text>
                        <Text as="div" marginY="2">
                          Humidity: {dt.humidity ?? 0} %
                        </Text>
                      </Box>
                    </Popup>
                  </Marker>
                ))}
              </Map>
            </Rounded>
            <Rounded
              height={{ base: '80vh', md: '65vh' }}
              padding="2"
              gridColumn={{ base: 'span 12', md: 'span 4', xl: 'span 3' }}
            >
              <RecordInfo record={statistic.records[currentData]} />
            </Rounded>
          </Grid>
        </Box>
      )}
    </Loading>
  );
}
