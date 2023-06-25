import {
  Box,
  Button,
  Link as CLink,
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
  faCheck,
  faDownload,
  faFileUpload,
  faFilterCircleXmark,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CreatableSelect as CRSelect } from 'chakra-react-select';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { routes } from '.';
import Link from '../comps/Link';
import Loading from '../comps/Loading';
import Rounded from '../comps/Rounded';
import { facCaretDown, facCaretNone, facCaretUp } from '../custom-icons';
import { Model } from '../types';
import { Pagination } from '../types/Pagination';
import { fakeModelTypes, fakeModels } from '../utils/faker';
import { dateString, genPageLinks, truncate, useQueries } from '../utils/funcs';

interface AddModelProps {
  onClose: Function;
}

interface Option {
  value: string;
  label: string;
  isNew?: boolean;
}

function AddModel({ onClose }: AddModelProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [file, setFile] = useState<File>();
  const [type, setType] = useState<Option | null>(null);

  const [typeFilter, setTypeFilter] = useState<string>();
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    fakeModelTypes({ filters: { modelType: typeFilter } }).then((res) => {
      const options = res.items.map(
        (t) =>
          ({
            value: t.typeId,
            label: t.typeName,
          } as Option),
      );

      setOptions(options);
    });
  }, [typeFilter]);

  const onSubmit = useCallback(
    (e: FormEvent<HTMLDivElement>) => {
      e.preventDefault();
      console.log(name, type, file);
    },
    [name, type, file],
  );

  return (
    <Flex flexDirection="column" gap="4" as="form" onSubmit={onSubmit}>
      <Input
        placeholder="Model name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <CRSelect
        placeholder="Model type"
        required
        isClearable
        createOptionPosition="first"
        value={type}
        options={options}
        onChange={(val) => setType(val)}
        onInputChange={(val) => setTypeFilter(val)}
        onCreateOption={(val) =>
          setType({ value: val, label: val, isNew: true })
        }
      />
      <Box>
        <Button
          width="100%"
          variant="outline"
          colorScheme={file ? 'blue' : 'gray'}
          leftIcon={<FontAwesomeIcon icon={faFileUpload} />}
          onClick={() => {
            fileRef.current?.click();
          }}
        >
          {file?.name ?? 'No file selected'}
        </Button>
        <Input
          display="none"
          type="file"
          required
          ref={fileRef}
          onChange={(e) => setFile(e.target.files?.[0])}
        />
      </Box>
      <Flex gap="4" marginY="4">
        <Button colorScheme="blue" flex="1" type="submit">
          Upload
        </Button>
        <Button colorScheme="gray" flex="1" onClick={() => onClose()}>
          Cancel
        </Button>
      </Flex>
    </Flex>
  );
}

export default function Models() {
  useEffect(() => {
    document.title = 'Models';
  }, []);

  const [params, setParams] = useQueries();

  const getLimit = useCallback(
    () => Number(params.get('limit')) || 10,
    [params],
  );
  const getPage = useCallback(() => Number(params.get('page')) || 1, [params]);
  const getOrderBy = useCallback(
    () => params.get('orderBy') ?? 'timestamp',
    [params],
  );
  const getOrderAsc = useCallback(() => {
    const orderBy = params.get('orderBy');
    const orderAsc = params.get('asc');
    return orderAsc ?? (orderBy ? 'asc' : 'dsc');
  }, [params]);

  const [limit, setLimit] = useState(getLimit());
  const [page, setPage] = useState(getPage());
  const [orderBy, setOrderBy] = useState(getOrderBy());
  const [orderAsc, setOrderAsc] = useState(getOrderAsc());
  const [pageLinks, setPageLinks] = useState<number[][]>([[], [page], []]);
  const [data, setData] = useState<Pagination<Model> | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const [newOpen, setNewOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(-1);

  type FiltersType = {
    beforeAt?: Date;
    afterAt?: Date;
    name?: string;
    type?: string;
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
      return setParams({ limit: '10' });
    }

    setLimit(limit);

    if (page < 1) {
      return setParams({ page: '1' });
    }

    if (data && page > data.totalPages) {
      return setParams({
        limit: limit.toString(),
        page: data.totalPages.toString(),
      });
    }

    setPage(page);
  }, [params, data]);

  useEffect(() => {
    if (data) setPageLinks(genPageLinks(data.page, data.totalPages));
  }, [data]);

  const getBefore = useCallback(() => dateString(filters.beforeAt), [filters]);

  const getAfter = useCallback(() => dateString(filters.afterAt), [filters]);

  const getData = useCallback(
    () =>
      fakeModels({
        limit,
        page,
        orderBy,
        orderAsc: orderAsc == 'asc',
        filters,
      }),
    [limit, page, orderBy, orderAsc, filters],
  );

  const deleteModel = useCallback(
    (model: Model) => {
      console.log('delete', model);
      setConfirmDelete(-1);
    },
    [setConfirmDelete],
  );

  const headers = [
    { name: '#' },
    { name: 'id', order: 'id' },
    { name: 'uploaded at', order: 'timestamp' },
    { name: 'name', order: 'name' },
    { name: 'type', order: 'type' },
    { name: '' },
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
        <Flex>
          <Input
            value={filters.name ?? ''}
            onChange={(e) =>
              setFilters((filters) => ({
                ...filters,
                name: e.target.value,
              }))
            }
            placeholder="Model name"
            minWidth="24"
            marginX={{ base: '0', md: '2' }}
          />
        </Flex>
        <Flex>
          <Input
            value={filters.type ?? ''}
            onChange={(e) =>
              setFilters((filters) => ({
                ...filters,
                type: e.target.value,
              }))
            }
            placeholder="Model type"
            minWidth="24"
            marginX={{ base: '0', md: '2' }}
          />
        </Flex>
        <Flex display={{ base: 'none', md: 'flex' }}>
          <Button marginX="4" onClick={() => setFilters({})}>
            <FontAwesomeIcon icon={faFilterCircleXmark} size="xl" />
          </Button>
          <Button marginEnd="4" onClick={() => setNewOpen(true)}>
            <FontAwesomeIcon icon={faPlus} size="xl" />
          </Button>
        </Flex>
      </Flex>
    );
  }, []);

  return (
    <Box padding="5" position="relative">
      <Modal isOpen={newOpen} onClose={() => setNewOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Upload new model</ModalHeader>
          <ModalBody>
            <AddModel onClose={() => setNewOpen(false)} />
          </ModalBody>
        </ModalContent>
      </Modal>
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
          <Button marginEnd="4" onClick={() => setNewOpen(true)}>
            <FontAwesomeIcon icon={faPlus} size="xl" />
          </Button>
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
                          setParams({
                            asc: orderAsc == 'asc' ? 'dsc' : 'asc',
                          });
                        } else {
                          setParams({
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
                      <Tooltip hasArrow placement="top" label={r.modelId}>
                        {truncate(r.modelId, 15)}
                      </Tooltip>
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
                    <Td>{r.modelName}</Td>
                    <Td>{r.type.typeName ?? ''}</Td>
                    <Td>
                      <Flex>
                        <Button
                          marginEnd="2"
                          background="green.300"
                          _hover={{ background: 'green.400' }}
                        >
                          <CLink href={r.modelFilePath}>
                            <FontAwesomeIcon icon={faDownload} />
                          </CLink>
                        </Button>
                        <Button
                          background="red.300"
                          _hover={{ background: 'red.400' }}
                          onClick={() => {
                            if (confirmDelete == idx) {
                              deleteModel(data.items[idx]);
                            } else {
                              setConfirmDelete(idx);
                            }
                          }}
                          onBlur={() => setConfirmDelete(-1)}
                        >
                          <FontAwesomeIcon
                            icon={confirmDelete == idx ? faCheck : faTrash}
                          />
                        </Button>
                      </Flex>
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
              to={routes.home.models}
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
              <Link disable={!page} to={routes.home.models} queries={{ page }}>
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
              <Link disable={!page} to={routes.home.models} queries={{ page }}>
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
              to={routes.home.models}
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
            onChange={(e) => setParams({ limit: e.target.value })}
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
