import {
  faFloppyDisk,
  faList,
  faSquarePollVertical,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { facDeepLearning } from '../custom-icons';

import {
  Box,
  Flex,
  Grid,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { Icon, Marker as LMarker } from 'leaflet';
import { useEffect, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import Map from '../comps/Map';
import Rounded from '../comps/Rounded';
import { getBounds, locationToLatLng, truncate } from '../utils/funcs';

import ImgZoom from '../comps/ImgZoom';
import ResultList from '../comps/ResultList';
import ReactWaveSurfer from '../comps/WaveSurfer';
import { Record } from '../types';
import { RED_MARKER, links } from '../utils/const';

const stas = [
  {
    name: 'New Records',
    value: 100,
    icon: faList,
    link: links.home.records(),
  },
  {
    name: 'Devices',
    value: 101,
    icon: faFloppyDisk,
    link: links.home.devices(),
  },
  {
    name: 'Models',
    value: 22,
    icon: facDeepLearning,
    link: links.home.models(),
  },
  {
    name: 'Percent OK',
    value: '88%',
    icon: faSquarePollVertical,
    link: links.home(),
  },
];

const datapoints = [
  {
    recordId: 'e8ae9eda-8707-4e35-812b-cebf17b47bcb',
    location: '35.68401735486973,139.7668688074273',
    humidity: 23,
    temperature: 21,
    audioFilePath:
      'https://assets.mixkit.co/active_storage/sfx/1660/1660-preview.mp3',
    imageFilePath:
      'https://img.timviec.com.vn/2020/06/xay-dung-cau-duong-2.jpg',
    device: {
      deviceName: 'Device 1',
      deviceId: '066c1346-57f2-4e55-9474-138dc9d52bea',
    },
    results: [
      {
        resultId: '6393802b-179c-4212-a488-1990434021c8',
        model: {
          modelId: '7a09c824-6c77-4e72-ac5a-be2358c94e4b',
          modelName: 'Model 1',
        },
        scores: [
          { label: { labelName: 'Ok' }, score: 0.8 },
          { label: { labelName: 'Break' }, score: 0.2 },
          { label: { labelName: 'Break 2' }, score: 0.8 },
          { label: { labelName: 'Break 3' }, score: 0.8 },
          { label: { labelName: 'Break 4' }, score: 0.8 },
          { label: { labelName: 'Break 5' }, score: 0.8 },
          { label: { labelName: 'Break 6' }, score: 0.8 },
          { label: { labelName: 'Break 7' }, score: 0.8 },
          { label: { labelName: 'Break 8' }, score: 0.8 },
          { label: { labelName: 'Break 9' }, score: 0.8 },
          { label: { labelName: 'Break 10' }, score: 0.8 },
        ],
      },
      {
        resultId: '88a2f6fe-2fc5-40d2-8a07-c5a89f57164d',
        model: {
          modelId: '44a76df8-0620-482e-a75b-b2509d8a539e',
          modelName: 'Model 2',
        },
        scores: [
          { label: { labelName: 'Ok' }, score: 0.9 },
          { label: { labelName: 'Break' }, score: 0.23 },
          { label: { labelName: 'Break 2' }, score: 0.28 },
          { label: { labelName: 'Break 3' }, score: 0.18 },
          { label: { labelName: 'Break 4' }, score: 0.3 },
          { label: { labelName: 'Break 5' }, score: 0.19 },
          { label: { labelName: 'Break 6' }, score: 0.22 },
          { label: { labelName: 'Break 7' }, score: 0.12 },
          { label: { labelName: 'Break 8' }, score: 0.32 },
          { label: { labelName: 'Break 9' }, score: 0.42 },
          { label: { labelName: 'Break 10' }, score: 0.26 },
        ],
      },
      {
        resultId: 'dbd84eb8-852a-420c-9d20-e10675730cb6',
        model: {
          modelId: 'db6b06c7-faac-452c-accb-8536389d4b8d',
          modelName: 'Model 3',
        },
        scores: [
          { label: { labelName: 'Ok' }, score: 0.8 },
          { label: { labelName: 'Break' }, score: 0.2 },
          { label: { labelName: 'Break 2' }, score: 0.8 },
          { label: { labelName: 'Break 3' }, score: 0.8 },
          { label: { labelName: 'Break 4' }, score: 0.8 },
          { label: { labelName: 'Break 5' }, score: 0.8 },
          { label: { labelName: 'Break 6' }, score: 0.8 },
          { label: { labelName: 'Break 7' }, score: 0.8 },
          { label: { labelName: 'Break 8' }, score: 0.8 },
          { label: { labelName: 'Break 9' }, score: 0.8 },
          { label: { labelName: 'Break 10' }, score: 0.8 },
        ],
      },
    ],
  },
  {
    recordId: 'a003a926-c1c0-451c-ad79-4537edeab81a',
    location: '35.78401735486973,139.6668688074273',
    humidity: 28,
    temperature: 25,
    audioFilePath:
      'https://assets.mixkit.co/active_storage/sfx/216/216-preview.mp3',
    imageFilePath:
      'https://saigonatn.com/img_data/images/tim-hieu-ket-cau-cua-cau-duong-bo.jpg',
    device: {
      deviceName: 'Device 1',
      deviceId: '066c1346-57f2-4e55-9474-138dc9d52bea',
    },
  },
  {
    recordId: '658b5907-661d-4ace-b1d9-e45d06659958',
    location: '35.70401735486973,139.6868688074273',
    humidity: 12,
    temperature: 11,
    audioFilePath:
      'https://assets.mixkit.co/active_storage/sfx/2102/2102-preview.mp3',
    imageFilePath:
      'https://sohanews.sohacdn.com/k:2014/2-20140924-160441-1416993185859/cau-duong-cay-cau-quay-dau-tien-o-viet-nam.jpg',
    device: {
      deviceName: 'Device 2',
      deviceId: 'ebc88978-f2e8-4875-b158-4c7de698dbc7',
    },
  },
] as Record[];

export default function Dashboard() {
  const [currentData, setCurrentData] = useState(0);

  useEffect(() => {
    document.title = 'Dashboard';
  }, []);

  return (
    <Box padding="5">
      <Grid
        templateColumns="repeat(12, 1fr)"
        gap={{ base: '5', xl: '6', '2xl': '8' }}
      >
        {stas.map((st, idx) => (
          <Rounded key={idx} flex="1" padding="5" gridColumn="span 3">
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
          gridColumn={{ base: '1/9', xl: '1/10' }}
        >
          <Map
            bounds={getBounds(
              datapoints.map((dt) => locationToLatLng(dt.location)),
            )}
          >
            {datapoints.map((dt, idx) => (
              <Marker
                key={idx}
                position={locationToLatLng(dt.location)}
                icon={idx == currentData ? RED_MARKER : new Icon.Default()}
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
                      src={dt.imageFilePath}
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
          height="65vh"
          padding="2"
          gridColumn={{ base: 'span 4', xl: 'span 3' }}
        >
          <Flex flexDirection="column" height="100%">
            <Text textAlign="center" fontWeight="bold">
              <Link to={links.home.records(datapoints[currentData]?.recordId)}>
                Record:{' '}
                <Tooltip
                  hasArrow
                  placement="top"
                  label={datapoints[currentData]?.recordId}
                >
                  {truncate(datapoints[currentData]?.recordId, 15)}
                </Tooltip>
              </Link>
            </Text>
            <Box paddingTop="4">
              <ReactWaveSurfer
                options={{
                  url: datapoints[currentData]?.audioFilePath,
                  normalize: true,
                  progressColor: '#EC407A',
                  waveColor: '#D1D6DA',
                  minPxPerSec: 500,
                  hideScrollbar: true,
                }}
              />
            </Box>
            <Tabs
              colorScheme="green"
              height={0}
              flex="1"
              display="flex"
              flexDirection="column"
            >
              <TabList>
                <Tab>Record Info</Tab>
                <Tab>Diagnostic Results</Tab>
              </TabList>
              <TabPanels
                height={0}
                flex="1"
                overflowY="auto"
                display="flex"
                flexDirection="column"
              >
                <TabPanel>
                  <Text marginBottom="2">
                    Uploaded by:{' '}
                    <Link
                      to={links.home.devices(
                        datapoints[currentData]?.device?.deviceId,
                      )}
                    >
                      <Text color="messenger.400" as="span">
                        {datapoints[currentData]?.device?.deviceName}
                      </Text>
                    </Link>
                  </Text>
                  <Text marginBottom="2">
                    Uploaded at:{' '}
                    <Tooltip
                      hasArrow
                      placement="top"
                      label={(
                        datapoints[currentData]?.timestamp ?? new Date()
                      ).toLocaleString()}
                    >
                      {(
                        datapoints[currentData]?.timestamp ?? new Date()
                      ).toLocaleDateString()}
                    </Tooltip>
                  </Text>
                  <Text marginBottom="2">
                    Temperature: {datapoints[currentData]?.temperature ?? 0} °C
                  </Text>
                  <Text marginBottom="2">
                    Humidity: {datapoints[currentData]?.humidity ?? 0} %
                  </Text>
                </TabPanel>
                <TabPanel paddingX={0} paddingBottom={0} height="100%">
                  <ResultList record={datapoints[currentData]} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Flex>
        </Rounded>
      </Grid>
    </Box>
  );
}
