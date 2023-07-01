import {
  Box,
  Button,
  Flex,
  Grid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { Marker as LMarker } from 'leaflet';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { useParams } from 'react-router-dom';
import { routes } from '..';
import Fft from '../../comps/Fft';
import ImgZoom from '../../comps/ImgZoom';
import Link from '../../comps/Link';
import Loading from '../../comps/Loading';
import Map from '../../comps/Map';
import ResultList from '../../comps/ResultList';
import Rounded from '../../comps/Rounded';
import ReactWaveSurfer from '../../comps/WaveSurfer';
import { modelService, recordService } from '../../services';
import { Model, Record } from '../../types';
import { Result } from '../../types/Result';
import { API_URL, BLUE_MARKER } from '../../utils/const';
import { locationToLatLng } from '../../utils/funcs';

type Option = {
  value: string;
  label: string;
};

function RightPanel({ record }: { record?: Record }) {
  const [model, setModel] = useState<Option | null>(null);
  const [models, setModels] = useState<Model[]>([]);
  const [searchFilter, setSearchFilter] = useState<string>();

  const [startDianostic, setStartDianostic] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<Result>();

  const toast = useToast();

  useEffect(() => {
    modelService
      .list({ modelName: searchFilter, orderBy: 'name' })
      .then((res) => {
        if (res.data) {
          setModels(res.data.items);
        } else {
          console.debug(res.error);
        }
      })
      .catch(console.debug);
  }, [searchFilter]);

  const options = useMemo(
    () =>
      models.map(
        (m) =>
          ({
            value: m.modelId,
            label: m.modelName,
          } as Option),
      ),
    [models],
  );

  const diagnostic = useCallback(async () => {
    if (!startDianostic || !model || !record) {
      return undefined;
    }

    return await recordService
      .diagnostic(record.recordId, model.value)
      .then((res) => {
        if (res.data) {
          record.results = [res.data, ...(record.results ?? [])];
          return res.data;
        }

        toast({
          position: 'top-right',
          status: 'error',
          description: res.error?.toString(),
        });
      })
      .catch((err) => (console.debug(err), undefined));
  }, [model, record, startDianostic]);

  const setData = useCallback(
    (res?: Result) => {
      setStartDianostic(false);
      if (res) {
        setDiagnosticResult(res);
      }
    },
    [setDiagnosticResult, setStartDianostic],
  );

  return (
    <>
      <Text marginBottom="2">
        Uploaded by:{' '}
        <Text as="span" color="messenger.400">
          <Link
            to={routes.home.devices}
            params={{ id: record?.device.deviceId }}
          >
            {record?.device.deviceName}
          </Link>
        </Text>
      </Text>
      <Text marginBottom="2">
        Uploaded at:{' '}
        <Tooltip
          hasArrow
          placement="top"
          label={new Date(record?.timestamp ?? '').toLocaleString()}
        >
          {new Date(record?.timestamp ?? '').toLocaleDateString()}
        </Tooltip>
      </Text>
      <Text marginBottom="2">Temperature: {record?.temperature ?? 0} °C</Text>
      <Text marginBottom="2">Humidity: {record?.humidity ?? 0} %</Text>
      <Tabs height={0} flex="1" display="flex" flexDirection="column">
        <TabList>
          <Tab>Diagnostic</Tab>
          <Tab>Results</Tab>
        </TabList>
        <TabPanels
          height={0}
          flex="1"
          overflow="auto"
          display="flex"
          flexDirection="column"
        >
          <TabPanel height={0} flex="1" display="flex" flexDirection="column">
            <Flex
              alignItems="center"
              justifyContent="space-between"
              as="form"
              onSubmit={(e) => {
                e.preventDefault();
                setStartDianostic(true);
              }}
            >
              <Select
                placeholder="Select Model"
                chakraStyles={{
                  container: (base, _props) => ({
                    ...base,
                    flex: '1',
                    marginEnd: '2',
                  }),
                }}
                value={model}
                onChange={(val) => setModel(val)}
                onInputChange={(val) => setSearchFilter(val ? val : undefined)}
                options={options}
              />
              <Button
                type="submit"
                background="messenger.300"
                _hover={{ background: 'messenger.400' }}
              >
                Diagnostic
              </Button>
            </Flex>
            <Box marginTop="4" height={0} flex="1" overflow="auto">
              <Loading getData={diagnostic} setData={setData}>
                {diagnosticResult && (
                  <Table size="sm">
                    <Thead position="sticky" top={0} background="gray.50">
                      <Tr>
                        <Th>Label</Th>
                        <Th>Score</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {diagnosticResult.scores?.map((sc, idx) => (
                        <Tr key={idx}>
                          <Td>{sc?.label?.labelName}</Td>
                          <Td>{sc?.score?.toFixed(4)}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )}
              </Loading>
            </Box>
          </TabPanel>
          <TabPanel paddingX={0} paddingBottom={0} height="100%">
            <ResultList record={record} truncateSize={40} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

export default function RecordDetail() {
  const params = useParams();

  const [record, setData] = useState<Record>();

  const getData = useCallback(
    () =>
      params.id
        ? recordService.get(params.id).then((res) => res.data)
        : Promise.resolve(undefined),
    [params],
  );

  return (
    <Box>
      <Loading getData={getData} setData={setData}>
        <Grid
          gap="4"
          margin="4"
          gridTemplate={{
            base: '200px 80vh 60vh/1fr',
            md: 'repeat(5, 12vh) / repeat(5, 1fr)',
          }}
          maxHeight={{ base: '80vh', md: 'unset' }}
          overflow="auto"
        >
          <Rounded
            gridArea={{ md: '1/1/span 2/span 3' }}
            display="flex"
            flexDirection="column"
          >
            <Tabs height={0} flex="1" display="flex" flexDirection="column">
              <TabList>
                <Tab>Audio</Tab>
                <Tab>Fast Fourier Transform</Tab>
              </TabList>
              <TabPanels height={0} flex="1" overflow="auto">
                <TabPanel width={{ base: '90vw', md: 'unset' }}>
                  <ReactWaveSurfer
                    options={{
                      height: 100,
                      url:
                        record?.audioFilePath &&
                        API_URL + '/record/audio/' + record?.audioFilePath,
                      normalize: true,
                      progressColor: '#EC407A',
                      waveColor: '#D1D6DA',
                      minPxPerSec: 500,
                      hideScrollbar: true,
                    }}
                  />
                </TabPanel>
                <TabPanel padding={0}>
                  <Fft fft={record?.audioFft} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Rounded>
          <Rounded gridArea={{ md: '3/1/span 3/span 3' }}>
            {record && (
              <Map center={locationToLatLng(record.location)}>
                <Marker
                  icon={BLUE_MARKER}
                  position={locationToLatLng(record.location)}
                  eventHandlers={{
                    add(e) {
                      const marker = e.target as LMarker;
                      const pop = marker.getPopup();
                      if (!pop?.isOpen()) {
                        pop?.toggle();
                      }
                    },
                  }}
                >
                  <Popup>
                    <ImgZoom
                      src={API_URL + '/record/images/' + record.imageFilePath}
                      width="52"
                      zoomScale={4}
                      transitionTime={0.3}
                    />
                  </Popup>
                </Marker>
              </Map>
            )}
          </Rounded>
          <Rounded
            gridArea={{ base: '2/auto/auto/auto', md: '1/4/span 5/span 2' }}
            padding="2"
            display="flex"
            flexDirection="column"
          >
            <RightPanel record={record} />
          </Rounded>
        </Grid>
      </Loading>
    </Box>
  );
}
