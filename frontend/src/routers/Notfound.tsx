import { Flex, Image, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import RoundedMain from '../comps/RoundedMain';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page Not Found';
  }, []);

  return (
    <RoundedMain>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="space-around"
        h="100%"
      >
        <Image src="/notfound.svg" width="60%" height="auto" />
        <Text fontSize="3xl" textAlign="center">
          Sorry, You are Not allowed to
          <br />
          Access This page
        </Text>
      </Flex>
    </RoundedMain>
  );
}
