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
} from '@chakra-ui/react';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { routes } from '.';
import Link from '../comps/Link';
import RoundedMain from '../comps/RoundedMain';

export default function Login({ register = false }) {
  const [showPassword, setShowPassword] = useState(false);

  const title = register ? 'Register account' : 'Login to Panel';

  useEffect(() => {
    document.title = title;
  }, [register]);

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
          onSubmit={(e) => {
            e.preventDefault();
          }}
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
