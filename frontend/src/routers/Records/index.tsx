import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { routes } from '..';
import { useStores } from '../../stores';
import { historyBack } from '../../utils/funcs';
import { build } from '../route';
import RecordDetail from './RecordDetail';
import RecordList from './RecordList';

export default function Records() {
  useEffect(() => {
    document.title = 'Records';
  }, []);

  const params = useParams();
  const navigate = useNavigate();
  const {
    historyStore: { history },
  } = useStores();

  const onClose = useCallback(() => {
    historyBack(history, navigate, build(routes.home.records));
  }, [navigate, history]);

  return (
    <>
      <Modal
        isOpen={!!params.id}
        onClose={onClose}
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent minHeight="80vh" minWidth="70vw">
          <ModalHeader>
            <Text>Record: {params.id}</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody background="background">
            <RecordDetail />
          </ModalBody>
        </ModalContent>
      </Modal>
      <RecordList />
    </>
  );
}
