import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { Record } from '../types';
import { links } from '../utils/const';
import { truncate } from '../utils/funcs';
import ResultList from './ResultList';
import ReactWaveSurfer from './WaveSurfer';

export interface Props {
  record?: Record;
}

export default function RecordInfo({ record }: Props) {
  return (
    <Flex flexDirection="column" height="100%">
      <Text textAlign="center" fontWeight="bold">
        Record:{' '}
        {record && (
          <Link to={links.home.records(record?.recordId)}>
            <Tooltip hasArrow placement="top" label={record?.recordId}>
              {truncate(record?.recordId ?? '', 15)}
            </Tooltip>
          </Link>
        )}
      </Text>
      <Box paddingTop="4">
        <ReactWaveSurfer
          options={{
            url: record?.audioFilePath,
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
          <TabPanel paddingX={0} paddingBottom={0}>
            {record ? (
              <>
                <Text marginBottom="2">
                  Uploaded by:{' '}
                  <Link to={links.home.devices(record?.device?.deviceId)}>
                    <Text color="messenger.400" as="span">
                      {record?.device?.deviceName}
                    </Text>
                  </Link>
                </Text>
                <Text marginBottom="2">
                  Uploaded at:{' '}
                  <Tooltip
                    hasArrow
                    placement="top"
                    label={(record?.timestamp ?? new Date()).toLocaleString()}
                  >
                    {(record?.timestamp ?? new Date()).toLocaleDateString()}
                  </Tooltip>
                </Text>
                <Text marginBottom="2">
                  Temperature: {record?.temperature ?? 0} °C
                </Text>
                <Text marginBottom="2">
                  Humidity: {record?.humidity ?? 0} %
                </Text>
              </>
            ) : (
              <>
                <Alert status="warning">
                  <AlertIcon />
                  <AlertDescription>No Data</AlertDescription>
                </Alert>
              </>
            )}
          </TabPanel>
          <TabPanel paddingX={0} paddingBottom={0} height="100%">
            <ResultList record={record} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
