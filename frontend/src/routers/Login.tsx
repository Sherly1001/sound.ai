import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
} from '@chakra-ui/react';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '.';
import Link from '../comps/Link';
import RoundedMain from '../comps/RoundedMain';
import { userService } from '../services';
import { useStores } from '../stores';
import { build } from './route';

export default function Login({ register = false }) {
  const title = register ? 'Register account' : 'Login to Panel';

  useEffect(() => {
    document.title = title;
  }, [register]);

  const toast = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { userStore } = useStores();

  useEffect(() => {
    if (userStore.user) {
      navigate(build(routes.home));
    }
  }, [userStore]);

  const postLogin = useCallback((username: string, password: string) => {
    const toastId = toast({
      status: 'info',
      position: 'top-right',
      description: 'Login in',
    });

    userService.login(username, password).then((res) => {
      if (res.data) {
        userStore.setToken(res.data);

        userService.getInfo().then((res) => {
          if (res.data) {
            userStore.setUser(res.data);
          } else {
            toast.update(toastId, {
              status: 'error',
              description: res.error?.toString(),
            });
          }
        });

        toast.update(toastId, {
          status: 'success',
          description: 'Login success',
        });
      } else {
        toast.update(toastId, {
          status: 'error',
          description: 'Username or password not match',
        });
      }
    });
  }, []);

  const postRegister = useCallback((username: string, password: string) => {
    const toastId = toast({
      status: 'info',
      position: 'top-right',
      description: 'Signgin in',
    });

    userService.register(username, password).then((res) => {
      if (res.data) {
        const user = res.data;
        userService
          .login(username, password)
          .then((res) => {
            if (res.data) {
              userStore.setToken(res.data);
              userStore.setUser(user);

              toast.update(toastId, {
                status: 'success',
                description: 'Register success',
              });
            }
          })
          .catch(console.debug);
      } else {
        toast.update(toastId, {
          status: 'error',
          description: 'Username already exists',
        });
      }
    });
  }, []);

  const onSubmit = useCallback(
    (e: FormEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (register) {
        postRegister(username, password);
      } else {
        postLogin(username, password);
      }
    },
    [username, password, register],
  );

  return (
    <RoundedMain>
      <Flex w="100%" h="100%">
        <Flex flex="1" justifyContent="center" display={['none', 'flex']}>
          <Image src="/login-img.svg" width="80%" />
        </Flex>
        <Flex
          flex="1"
          as="form"
          direction="column"
          justifyContent="center"
          padding="2.5em"
          onSubmit={onSubmit}
        >
          <Text fontSize="4xl" textAlign="center" marginBottom="1em">
            {title}
          </Text>
          <FormControl marginBottom="1.5em">
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              placeholder="Enter your username"
              background="background"
              border="none"
              required
              _placeholder={{
                color: 'gray.400',
              }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
          <FormControl marginBottom="2em">
            <FormLabel>Password</FormLabel>
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
          <Button
            background="facebook.400"
            color="white"
            type="submit"
            marginBottom="1em"
            _hover={{
              background: 'facebook.500',
            }}
          >
            {register ? 'Register' : 'Login'}
          </Button>
          {register ? (
            <Text textAlign="right" as="i" color="gray.500">
              or{' '}
              <Text color="cyan.700" as="span">
                <Link to={routes.login}>Login</Link>
              </Text>
              .
            </Text>
          ) : (
            <Text textAlign="right" as="i" color="gray.500">
              or{' '}
              <Text color="cyan.700" as="span">
                <Link to={routes.register}>Register</Link>
              </Text>{' '}
              new account.
            </Text>
          )}
        </Flex>
      </Flex>
    </RoundedMain>
  );
}
