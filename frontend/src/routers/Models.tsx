import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
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
  useToast,
} from '@chakra-ui/react';
import {
  faCaretLeft,
  faCaretRight,
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
import { modelService } from '../services';
import { useStores } from '../stores';
import { Model } from '../types';
import { Pagination } from '../types/Pagination';
import { API_URL } from '../utils/const';
import { dateString, genPageLinks, truncate, useQueries } from '../utils/funcs';

interface AddModelProps {
  onClose: Function;
  onCreated: (model: Model) => void;
}

interface Option {
  value: string;
  label: string;
  isNew?: boolean;
}

function AddModel({ onClose, onCreated }: AddModelProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [file, setFile] = useState<File>();
  const [type, setType] = useState<Option | null>(null);

  const [typeFilter, setTypeFilter] = useState<string>();
  const [options, setOptions] = useState<Option[]>([]);

  const toast = useToast();
  const { userStore } = useStores();

  useEffect(() => {
    modelService
      .listType({
        modelType: typeFilter,
      })
      .then((res) => {
        if (!res.data) return;
        const options = res.data.items.map(
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
      if (!name || !type || !file) return;

      const upload = (type: string) => {
        const toastId = toast({
          position: 'top-right',
          status: 'info',
          description: 'Uploading new model',
        });

        modelService.upload(name, type, file).then((res) => {
          if (res.data) {
            toast.update(toastId, {
              status: 'success',
              description: 'Uploaded',
            });

            onCreated(res.data);
            onClose();
          } else {
            toast.update(toastId, {
              status: 'error',
              description: res.error?.toString(),
            });
          }
        });
      };

      if (type.isNew && userStore.user?.isAdmin) {
        modelService.createType(type.value).then((res) => {
          if (res.data) {
            return upload(res.data.typeId);
          }
        });
      } else {
        upload(type.value);
      }
    },
    [name, type, file, userStore],
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
        isValidNewOption={(input) =>
          !!input &&
          !!userStore.user?.isAdmin &&
          !options.find((o) => o.label == input)
        }
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

  const toast = useToast();
  const { userStore } = useStores();
  const [params, setParams] = useQueries();

  const getLimit = useCallback(
    () => Number(params.get('limit')) || 10,
    [params],
  );
  const getPage = useCallback(() => Number(params.get('page')) || 1, [params]);
  const getOrderBy = useCallback(
    () => params.get('orderBy') ?? 'time',
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
  const cancelRef = useRef(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  type FiltersType = {
    beforeAt?: Date;
    afterAt?: Date;
    modelName?: string;
    modelType?: string;
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

  const getData = useCallback(
    () =>
      modelService
        .list({
          limit,
          page,
          orderBy,
          orderASC: orderAsc == 'asc',
          ...filters,
        })
        .then((res) => res.data ?? null)
        .catch((err) => (console.debug(err), null)),
    [limit, page, orderBy, orderAsc, filters],
  );

  const deleteModel = useCallback(
    (model?: Model) => {
      setConfirmDelete(-1);
      if (!model) return;

      if (userStore.user?.isAdmin) {
        const toastId = toast({
          position: 'top-right',
          status: 'info',
          description: 'Deleting model',
        });

        modelService.remove(model.modelId).then((res) => {
          setDeleteOpen(false);
          if (res.data) {
            toast.update(toastId, {
              status: 'success',
              description: 'Deleted',
            });

            setData(
              (data) =>
                data && {
                  ...data,
                  items: data.items.filter((m) => m.modelId != model.modelId),
                },
            );
          } else {
            toast.update(toastId, {
              status: 'error',
              description: res.error?.toString(),
            });
          }
        });
      }
    },
    [confirmDelete, userStore],
  );

  const headers = [
    { name: '#' },
    { name: 'id', order: 'id' },
    { name: 'uploaded at', order: 'time' },
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
              value={dateString(filters.afterAt) ?? ''}
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
              value={dateString(filters.beforeAt) ?? ''}
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
            value={filters.modelName ?? ''}
            onChange={(e) =>
              setFilters((filters) => ({
                ...filters,
                modelName: e.target.value,
              }))
            }
            placeholder="Model name"
            minWidth="24"
            marginX={{ base: '0', md: '2' }}
          />
        </Flex>
        <Flex>
          <Input
            value={filters.modelType ?? ''}
            onChange={(e) =>
              setFilters((filters) => ({
                ...filters,
                modelType: e.target.value,
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
            <AddModel
              onClose={() => setNewOpen(false)}
              onCreated={(model) =>
                setData(
                  (data) => data && { ...data, items: [model, ...data.items] },
                )
              }
            />
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
                        label={new Date(r.timestamp).toLocaleString()}
                      >
                        {new Date(r.timestamp).toLocaleDateString()}
                      </Tooltip>
                    </Td>
                    <Td>{r.modelName}</Td>
                    <Td>{r.type.typeName ?? ''}</Td>
                    <Td>
                      <Flex>
                        <CLink href={API_URL + '/model/download/' + r.modelId}>
                          <Button
                            marginEnd="2"
                            background="green.300"
                            _hover={{ background: 'green.400' }}
                          >
                            <FontAwesomeIcon icon={faDownload} />
                          </Button>
                        </CLink>
                        {userStore.user?.isAdmin && (
                          <Button
                            background="red.300"
                            _hover={{ background: 'red.400' }}
                            onClick={() => {
                              setConfirmDelete(idx);
                              setDeleteOpen(true);
                            }}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        )}
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
      <AlertDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete model: {data?.items[confirmDelete]?.modelName}
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setDeleteOpen(false)}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => deleteModel(data?.items[confirmDelete])}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
