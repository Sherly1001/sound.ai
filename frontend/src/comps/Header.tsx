import { Box, Button, Flex, Select, Text } from '@chakra-ui/react';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ForwardedRef, forwardRef } from 'react';

export interface HeaderProps {
  headerOver: boolean;
  toggleNav: Function;
}

function Header(
  { headerOver, toggleNav }: HeaderProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const username = 'Username';
  const langs = [
    { value: 'en', name: 'English' },
    { value: 'jp', name: '日本語' },
    { value: 'vi', name: 'Tiếng Việt' },
  ];

  return (
    <Flex
      ref={ref}
      position="sticky"
      top="0"
      paddingX="5"
      paddingY={headerOver ? '0' : '5'}
      background={headerOver ? 'white' : undefined}
      boxShadow={headerOver ? '0px 0px 4px -2px #00000040' : undefined}
      transition="all 0.3s"
      alignItems="center"
      zIndex="overlay"
    >
      <Button
        background="transparent"
        marginEnd="2"
        onClick={() => toggleNav()}
        display={{ base: 'block', md: 'none' }}
      >
        <FontAwesomeIcon icon={faBars} />
      </Button>
      <Box flex="1">
        <Flex direction="column">
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="black"
            display={{ base: 'none', md: 'block' }}
          >
            Hello, {username}
          </Text>
          <Text color="red.600">{new Date().toDateString()}</Text>
        </Flex>
      </Box>
      <Box>
        <Select
          background="white"
          boxShadow={headerOver ? 'none' : '0px 0px 4px 0px #00000040'}
          border="none"
        >
          {langs.map((lang, idx) => (
            <option key={idx} value={lang.value}>
              {lang.name}
            </option>
          ))}
        </Select>
      </Box>
    </Flex>
  );
}

export default forwardRef(Header);
