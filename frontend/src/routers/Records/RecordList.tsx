import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  SlideFade,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react';
import {
  faCaretLeft,
  faCaretRight,
  faFilterCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { routes } from '..';
import Link from '../../comps/Link';
import Loading from '../../comps/Loading';
import PlayAudio from '../../comps/PlayAudio';
import Rounded from '../../comps/Rounded';
import { facCaretDown, facCaretNone, facCaretUp } from '../../custom-icons';
import { Record } from '../../types';
import { Pagination } from '../../types/Pagination';
import { fakeRecords } from '../../utils/faker';
import {
  dateString,
  genPageLinks,
  truncate,
  useQueries,
} from '../../utils/funcs';

export default function RecordList() {
  const [searchParams, setSearchParams] = useQueries();

  const getLimit = useCallback(
    () => Number(searchParams.get('limit')) || 10,
    [searchParams],
  );
  const getPage = useCallback(
    () => Number(searchParams.get('page')) || 1,
    [searchParams],
  );
  const getOrderBy = useCallback(
    () => searchParams.get('orderBy') ?? 'timestamp',
    [searchParams],
  );
  const getOrderAsc = useCallback(() => {
    const orderBy = searchParams.get('orderBy');
    const orderAsc = searchParams.get('asc');
    return orderAsc ?? (orderBy ? 'asc' : 'dsc');
  }, [searchParams]);

  const [limit, setLimit] = useState(getLimit());
  const [page, setPage] = useState(getPage());
  const [orderBy, setOrderBy] = useState(getOrderBy());
  const [orderAsc, setOrderAsc] = useState(getOrderAsc());
  const [pageLinks, setPageLinks] = useState<number[][]>([[], [page], []]);
  const [data, setData] = useState<Pagination<Record> | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  type FiltersType = {
    beforeAt?: Date;
    afterAt?: Date;
    deviceName?: string;
    temperature?: string;
    humidity?: string;
  };

  const [filters, setFilters] = useState<FiltersType>({});

  useEffect(() => {
    const limit = getLimit();
    const page = getPage();
    const orderBy = getOrderBy();
    const orderAsc = getOrderAsc();

    setOrderBy(orderBy);
    setOrderAsc(orderAsc);

    if (limit < 1) {
      return setSearchParams({ limit: '10' });
    }

    setLimit(limit);

    if (page < 1) {
      return setSearchParams({ page: '1' });
    }

    if (data && page > data.totalPages) {
      return setSearchParams({
        limit: limit.toString(),
        page: data.totalPages.toString(),
      });
    }

    setPage(page);
  }, [searchParams, data]);

  useEffect(() => {
    if (data) setPageLinks(genPageLinks(data.page, data.totalPages));
  }, [data]);

  const getBefore = useCallback(() => dateString(filters.beforeAt), [filters]);

  const getAfter = useCallback(() => dateString(filters.afterAt), [filters]);

  const getData = useCallback(
    () =>
      fakeRecords({
        limit,
        page,
        orderBy,
        orderAsc: orderAsc == 'asc',
        filters,
      }),
    [limit, page, orderBy, orderAsc, filters],
  );

  const headers = [
    { name: '#' },
    { name: 'id', order: 'id' },
    { name: 'uploaded at', order: 'timestamp' },
    { name: 'by device', order: 'device' },
    { name: 'temperature', order: 'temperature' },
    { name: 'humidity', order: 'humidity' },
    { name: 'audio' },
  ];

  const Filters = useCallback(({ filters }: { filters: FiltersType }) => {
    return (
      <Flex
        flex="1"
        justifyContent="space-between"
        flexDirection={{ base: 'column', md: 'row' }}
        gap={{ base: '2', md: '0' }}
      >
        <Flex flexDirection={{ base: 'column', md: 'row' }}>
          <Flex alignItems="center" marginX={{ base: '0', md: '4' }}>
            <Text marginX="2" minWidth={{ base: '12', md: 'unset' }}>
              After
            </Text>
            <Input
              value={getAfter() ?? ''}
              onChange={(e) =>
                setFilters((filters) => ({
                  ...filters,
                  afterAt: new Date(e.target.value),
                }))
              }
              size="sm"
              type="datetime-local"
              cursor="pointer"
            />
          </Flex>
          <Flex alignItems="center" marginX={{ base: '0', md: '4' }}>
            <Text marginX="2" minWidth={{ base: '12', md: 'unset' }}>
              Before
            </Text>
            <Input
              value={getBefore() ?? ''}
              onChange={(e) =>
                setFilters((filters) => ({
                  ...filters,
                  beforeAt: new Date(e.target.value),
                }))
              }
              size="sm"
              type="datetime-local"
              cursor="pointer"
            />
          </Flex>
        </Flex>
        <Flex flex="1">
          <Input
            value={filters.deviceName ?? ''}
            onChange={(e) =>
              setFilters((filters) => ({
                ...filters,
                deviceName: e.target.value,
              }))
            }
            placeholder="Device name"
            minWidth="24"
          />
        </Flex>
        <Flex justifyContent="space-between">
          <Tooltip hasArrow placement="top" label="number or min,max">
            <Input
              value={filters.temperature ?? ''}
              onChange={(e) =>
                setFilters((filters) => ({
                  ...filters,
                  temperature: e.target.value,
                }))
              }
              placeholder="Temperature"
              maxWidth="32"
              minWidth="20"
              marginX={{ base: '0', md: '2' }}
            />
          </Tooltip>
          <Tooltip hasArrow placement="top" label="number or min,max">
            <Input
              value={filters.humidity ?? ''}
              onChange={(e) =>
                setFilters((filters) => ({
                  ...filters,
                  humidity: e.target.value,
                }))
              }
              placeholder="Humidity"
              maxWidth="32"
              minWidth="20"
              marginX={{ base: '0', md: '2' }}
            />
          </Tooltip>
        </Flex>
        <Flex display={{ base: 'none', md: 'flex' }}>
          <Button marginX="4" onClick={() => setFilters({})}>
            <FontAwesomeIcon icon={faFilterCircleXmark} size="xl" />
          </Button>
        </Flex>
      </Flex>
    );
  }, []);

  return (
    <Box padding="5" position="relative">
      <Rounded
        height="16"
        position="sticky"
        top="0"
        zIndex="sticky"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        as="form"
        onSubmit={(e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
        }}
      >
        <Modal isOpen={filterOpen} onClose={() => setFilterOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <ModalCloseButton />
              <Text>Filters</Text>
            </ModalHeader>
            <ModalBody>
              <Filters filters={filters} />
            </ModalBody>
          </ModalContent>
        </Modal>
        <Flex
          display={{ base: 'flex', md: 'none' }}
          paddingX="2"
          flex="1"
          justifyContent="space-between"
        >
          <Button onClick={() => setFilterOpen(true)}>Filters</Button>
          <Button onClick={() => setFilters({})}>Clear filters</Button>
        </Flex>
        <Flex display={{ base: 'none', md: 'flex' }} flex="1">
          <Filters filters={filters} />
        </Flex>
      </Rounded>
      <Rounded marginY="4" height="65vh" overflow="auto">
        <Box>
          <Loading fader={SlideFade} getData={getData} setData={setData}>
            <Table variant="striped" position="relative">
              <Thead
                top={0}
                position="sticky"
                zIndex="sticky"
                background="gray.50"
                userSelect="none"
              >
                <Tr>
                  {headers.map((h, idx) => (
                    <Th
                      key={idx}
                      cursor="pointer"
                      onClick={() => {
                        if (!h.order) return;
                        if (h.order == orderBy) {
                          setSearchParams({
                            asc: orderAsc == 'asc' ? 'dsc' : 'asc',
                          });
                        } else {
                          setSearchParams({
                            orderBy: h.order,
                            asc: 'asc',
                          });
                        }
                      }}
                    >
                      {h.order && (
                        <FontAwesomeIcon
                          icon={
                            orderBy != h.order
                              ? facCaretNone
                              : orderAsc == 'asc'
                              ? facCaretUp
                              : facCaretDown
                          }
                        />
                      )}
                      {h.name}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {data?.items.map((r, idx) => (
                  <Tr key={idx}>
                    <Td>{idx + limit * (page - 1) + 1}</Td>
                    <Td>
                      <Link
                        to={routes.home.records}
                        params={{ id: r.recordId }}
                      >
                        <Tooltip hasArrow placement="top" label={r.recordId}>
                          {truncate(r.recordId, 15)}
                        </Tooltip>
                      </Link>
                    </Td>
                    <Td>
                      <Tooltip
                        hasArrow
                        placement="top"
                        label={(r.timestamp ?? new Date()).toLocaleString()}
                      >
                        {(r.timestamp ?? new Date()).toLocaleDateString()}
                      </Tooltip>
                    </Td>
                    <Td>
                      <Text color="messenger.400">
                        <Link
                          to={routes.home.devices}
                          params={{ id: r.device.deviceId }}
                        >
                          {r.device.deviceName}
                        </Link>
                      </Text>
                    </Td>
                    <Td>{r.temperature ?? 0} °C</Td>
                    <Td>{r.humidity ?? 0} %</Td>
                    <Td>
                      <PlayAudio src={r.audioFilePath} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Loading>
        </Box>
      </Rounded>
      <Flex
        userSelect="none"
        flexDirection={{ base: 'column', md: 'row-reverse' }}
        justifyContent="space-between"
      >
        <Box alignSelf="flex-end">
          <Text
            color={data?.hasPrev ? 'blue.500' : 'gray.500'}
            as="span"
            marginX="2"
            cursor="pointer"
          >
            <Link
              disable={!data?.hasPrev}
              to={routes.home.records}
              queries={{ page: page - 1 }}
            >
              <FontAwesomeIcon icon={faCaretLeft} />
            </Link>
          </Text>
          {pageLinks[0]?.map((page, idx) => (
            <Text
              key={idx}
              as="span"
              marginX="2"
              color="blue.500"
              cursor="pointer"
            >
              <Link disable={!page} to={routes.home.records} queries={{ page }}>
                {page ? page : '...'}
              </Link>
            </Text>
          ))}
          <Text as="span" marginX="2" cursor="pointer">
            {pageLinks[1]?.[0]}
          </Text>
          {pageLinks[2]?.map((page, idx) => (
            <Text
              key={idx}
              as="span"
              marginX="2"
              color="blue.500"
              cursor="pointer"
            >
              <Link disable={!page} to={routes.home.records} queries={{ page }}>
                {page ? page : '...'}
              </Link>
            </Text>
          ))}
          <Text
            color={data?.hasNext ? 'blue.500' : 'gray.500'}
            as="span"
            marginX="2"
            cursor="pointer"
          >
            <Link
              disable={!data?.hasNext}
              to={routes.home.records}
              queries={{ page: page + 1 }}
            >
              <FontAwesomeIcon icon={faCaretRight} />
            </Link>
          </Text>
        </Box>
        <Flex alignItems="center" alignSelf="flex-start">
          Showing{' '}
          <Select
            marginX="1"
            value={limit}
            onChange={(e) => setSearchParams({ limit: e.target.value })}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </Select>{' '}
          rows
        </Flex>
      </Flex>
    </Box>
  );
}
