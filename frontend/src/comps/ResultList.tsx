import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Flex,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Link from '../comps/Link';
import { routes } from '../routers';
import { Record } from '../types';
import { truncate } from '../utils/funcs';

export interface Props {
  record?: Record;
  truncateSize?: number;
}

export default function ResultList({ record, truncateSize = 25 }: Props) {
  const [currentResult, setCurrentResult] = useState(0);

  useEffect(() => {
    setCurrentResult(0);
  }, [record]);

  return record?.results && record?.results.length > 0 ? (
    <Flex height="100%" flexDirection="column">
      <Tooltip
        hasArrow
        placement="top"
        label={record.results[currentResult]?.resultId}
      >
        <Select
          textAlign="center"
          onChange={(e) => setCurrentResult(+e.target.value)}
          value={currentResult}
        >
          {record.results?.map((rs, idx) => (
            <option key={idx} value={idx}>
              {truncate(rs.resultId, truncateSize)}
            </option>
          ))}
        </Select>
      </Tooltip>
      {((result) => (
        <>
          <Box paddingX="4" fontSize="sm" textAlign="center" color="gray.600">
            <Text>
              Diagnostic by {result?.diagnosticByUser ? 'user' : 'device'}:{' '}
              <Link
                disable={!!result?.diagnosticByUser}
                to={routes.home.devices}
                params={{ id: result?.diagnosticByDevice?.deviceId }}
              >
                <Text as="span" color="messenger.400">
                  {result?.diagnosticByUser
                    ? result?.diagnosticByUser?.username
                    : result?.diagnosticByDevice?.deviceName}
                </Text>
              </Link>
            </Text>
            <Text>
              Diagnostic with model:{' '}
              <Link
                disable={!result?.model?.modelName}
                to={routes.home.models}
                params={{ id: result?.model?.modelId }}
              >
                <Text
                  as="span"
                  color={result?.model ? 'messenger.400' : 'gray.400'}
                >
                  {result?.model?.modelName ?? 'deleted'}
                </Text>
              </Link>
            </Text>
            <Text>
              Diagnostic at:{' '}
              <Tooltip
                hasArrow
                placement="top"
                label={new Date(result?.timestamp ?? '').toLocaleString()}
              >
                {new Date(result?.timestamp ?? '').toLocaleDateString()}
              </Tooltip>
            </Text>
          </Box>
          <Box height={0} flex="1" overflowY="auto">
            <Table size="sm">
              <Thead position="sticky" top={0} background="gray.50">
                <Tr>
                  <Th>Label</Th>
                  <Th>Score</Th>
                </Tr>
              </Thead>
              <Tbody>
                {result?.scores?.map((sc, idx) => (
                  <Tr key={idx}>
                    <Td>{sc?.label?.labelName}</Td>
                    <Td>{sc?.score?.toFixed(4)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </>
      ))(record.results?.[currentResult])}
    </Flex>
  ) : (
    <>
      <Alert status="warning" fontSize="sm">
        <AlertIcon />
        <AlertDescription>
          Not diagnostic yet,{' '}
          <Link to={routes.home.records} params={{ id: record?.recordId }}>
            <Text as="span" color="messenger.400">
              diagnostic
            </Text>
          </Link>{' '}
          now.
        </AlertDescription>
      </Alert>
    </>
  );
}
