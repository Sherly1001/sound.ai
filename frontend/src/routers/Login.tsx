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
import { Link } from 'react-router-dom';
import Rounded from '../comps/Rounded';

export default function Login({ register = false }) {
  const [showPassword, setShowPassword] = useState(false);

  const title = register ? 'Register account' : 'Login to Panel';

  useEffect(() => {
    document.title = title;
  }, [register]);

  return (
    <Rounded>
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
              background="holder"
              border="none"
              required
              _placeholder={{
                color: 'holderText',
              }}
            />
          </FormControl>
          <FormControl marginBottom="2em">
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                background="holder"
                border="none"
                required
                _placeholder={{
                  color: 'holderText',
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
            background="blue"
            color="white"
            type="submit"
            marginBottom="1em"
            _hover={{
              background: 'darkBlue',
            }}
          >
            {register ? 'Register' : 'Login'}
          </Button>
          {register ? (
            <Text textAlign="right" as="i" color="gray">
              or{' '}
              <Text color="blue" as="span">
                <Link to="/login">Login</Link>
              </Text>
              .
            </Text>
          ) : (
            <Text textAlign="right" as="i" color="gray">
              or{' '}
              <Text color="blue" as="span">
                <Link to="/register">Register</Link>
              </Text>{' '}
              new account.
            </Text>
          )}
        </Flex>
      </Flex>
    </Rounded>
  );
}
