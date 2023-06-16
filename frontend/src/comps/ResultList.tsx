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
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Record } from '../types';
import { links } from '../utils/const';
import { truncate } from '../utils/funcs';

export interface Props {
  record?: Record;
}

export default function ResultList({ record }: Props) {
  const [currentResult, setCurrentResult] = useState(0);
  return record?.results && record?.results.length > 0 ? (
    <Flex height="100%" flexDirection="column">
      <Tooltip
        hasArrow
        placement="top"
        label={record.results[currentResult]?.resultId}
      >
        <Select
          onChange={(e) => setCurrentResult(+e.target.value)}
          value={currentResult}
        >
          {record.results?.map((rs, idx) => (
            <option key={idx} value={idx}>
              {truncate(rs.resultId, 25)}
            </option>
          ))}
        </Select>
      </Tooltip>
      {((result) => (
        <>
          <Box paddingX="4" fontSize="sm" textAlign="center" color="gray.600">
            <Text>
              Diagnostic with model:{' '}
              <Link to={links.home.models(result?.model?.modelId)}>
                <Text as="span" color="messenger.400">
                  {result?.model?.modelName}
                </Text>
              </Link>
            </Text>
            <Text>
              Diagnostic at:{' '}
              <Tooltip
                hasArrow
                placement="top"
                label={(result?.timestamp ?? new Date()).toLocaleString()}
              >
                {(result?.timestamp ?? new Date()).toLocaleDateString()}
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
                    <Td>{sc?.score}</Td>
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
          <Link to={links.home.records(record?.recordId)}>
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
