import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from '@chakra-ui/react';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import Rounded from '../comps/Rounded';

export default function Settings() {
  useEffect(() => {
    document.title = 'Settings';
  }, []);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = useCallback(
    (e: FormEvent<HTMLDivElement>) => {
      e.preventDefault();
    },
    [username, password, currentPassword],
  );

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
        </Grid>
      </Rounded>
    </Box>
  );
}
