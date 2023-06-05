import { Box, Flex, Select, Text } from '@chakra-ui/react';
import { ForwardedRef, forwardRef } from 'react';

export interface HeaderProps {
  headerOver: boolean;
}

function Header(
  { headerOver }: HeaderProps,
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
      position="sticky"
      top="0"
      paddingX="5"
      paddingY={headerOver ? '0' : '5'}
      background={headerOver ? 'white' : undefined}
      boxShadow={headerOver ? '0px 0px 4px -2px #00000040' : undefined}
      transition="all 0.3s"
      alignItems="center"
    >
      <Box flex="1" ref={ref}>
        <Flex direction="column">
          <Text fontSize="2xl" fontWeight="bold" color="black">
            Hello, {username}
          </Text>
          <Text color="red">{new Date().toDateString()}</Text>
        </Flex>
      </Box>
      <Box>
        <Select
          background="white"
          boxShadow="0px 0px 4px 0px #00000040"
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
