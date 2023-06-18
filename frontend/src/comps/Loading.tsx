import {
  Box,
  Fade,
  Flex,
  ScaleFade,
  SlideFade,
  Spinner,
} from '@chakra-ui/react';
import { ReactNode, useEffect, useState } from 'react';

export interface Props<T> {
  getData: () => Promise<T>;
  setData: (data: T) => void;
  fader?: typeof Fade | typeof ScaleFade | typeof SlideFade;
  showWhileLoading?: boolean;
  spinerSize?: string;
  initialScale?: number;
  children?: ReactNode;
}

export default function Loading<T>({
  getData,
  setData,
  fader = ScaleFade,
  showWhileLoading = false,
  spinerSize = 'xl',
  initialScale = 0.7,
  children,
}: Props<T>) {
  const Fader = fader;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getData().then((data) => {
      setLoading(false);
      setData(data);
    });
  }, [getData, setData]);

  return (
    <Box position="relative">
      {loading && (
        <Flex
          position="absolute"
          width="100%"
          height="100%"
          zIndex="modal"
          userSelect="none"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size={spinerSize}
          />
        </Flex>
      )}
      <Fader initialScale={initialScale} in={showWhileLoading || !loading}>
        {children}
      </Fader>
    </Box>
  );
}
