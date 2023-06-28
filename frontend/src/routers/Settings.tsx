import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
} from '@chakra-ui/react';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import Rounded from '../comps/Rounded';
import { userService } from '../services';
import { useStores } from '../stores';

export default function Settings() {
  useEffect(() => {
    document.title = 'Settings';
  }, []);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const cancelRef = useRef(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const toast = useToast();
  const { userStore } = useStores();

  const onSubmit = useCallback(
    (e: FormEvent<HTMLDivElement>) => {
      e.preventDefault();

      if (!username && !password) {
        return toast({
          position: 'top-right',
          status: 'error',
          description: 'Both username and new password are empty',
        });
      }

      const toastId = toast({
        position: 'top-right',
        status: 'info',
        description: 'Updating',
      });

      userService.update(currentPassword, username, password).then((res) => {
        if (res.data) {
          userStore.setUser(res.data);
          toast.update(toastId, {
            status: 'success',
            description: 'Update success',
          });
        } else {
          let err = res.error?.toString() ?? '';
          if (err.startsWith('UnauthorizedException: ')) {
            err = err.replace('UnauthorizedException: ', '');
          } else if (err.includes('already exists')) {
            err = 'Username already exists';
          }

          toast.update(toastId, {
            status: 'error',
            description: err,
          });
        }
      });
    },
    [username, password, currentPassword],
  );

  const onDelete = useCallback(() => {
    setDeleteOpen(false);

    const toastId = toast({
      position: 'top-right',
      status: 'info',
      description: 'Deleting account',
    });

    userService.remove().then((res) => {
      if (res.data) {
        toast.update(toastId, { status: 'success', description: 'Deleted' });
        userStore.logout();
      }
    });
  }, []);

  return (
    <Box>
      <Rounded padding="4">
        <Text fontSize="large" fontWeight="bold">
          User info
        </Text>
        <hr />
        <Grid
          gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
          gap="4"
          marginTop="4"
          as="form"
          onSubmit={onSubmit}
        >
          <FormControl marginBottom="1.5em">
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              placeholder="Enter new username"
              background="background"
              border="none"
              _placeholder={{
                color: 'gray.400',
              }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
          <FormControl marginBottom="2em">
            <FormLabel>New Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                background="background"
                border="none"
                _placeholder={{
                  color: 'gray.400',
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement
                cursor="pointer"
                onClick={() => setShowPassword(!showPassword)}
                userSelect="none"
              >
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl marginBottom="2em">
            <FormLabel>Current Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                background="background"
                border="none"
                required
                _placeholder={{
                  color: 'gray.400',
                }}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <InputRightElement
                cursor="pointer"
                onClick={() => setShowPassword(!showPassword)}
                userSelect="none"
              >
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button type="submit" colorScheme="blue" alignSelf="center">
            Update
          </Button>
          <Box>
            <Button colorScheme="red" onClick={() => setDeleteOpen(true)}>
              Delete account
            </Button>
            <AlertDialog
              isOpen={deleteOpen}
              onClose={() => setDeleteOpen(false)}
              leastDestructiveRef={cancelRef}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Delete account
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure? You can't undo this action afterwards.
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button
                      ref={cancelRef}
                      onClick={() => setDeleteOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button colorScheme="red" onClick={onDelete} ml={3}>
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </Box>
        </Grid>
      </Rounded>
    </Box>
  );
}
