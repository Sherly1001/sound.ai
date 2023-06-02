import { Flex, Image, Text } from '@chakra-ui/react';
import Rounded from '../comps/Rounded';

export default function NotFound() {
  return (
    <Rounded>
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
    </Rounded>
  );
}
