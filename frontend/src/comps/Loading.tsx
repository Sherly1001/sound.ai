import { Box, Flex, ScaleFade, Spinner } from '@chakra-ui/react';
import { ReactNode, useEffect, useState } from 'react';

export interface Props<T> {
  getData: () => Promise<T>;
  setData: (data: T) => void;
  children?: ReactNode;
  spinerSize?: string;
  initialScale?: number;
}

export default function Loading<T>({
  getData,
  setData,
  children,
  spinerSize = 'xl',
  initialScale = 0.7,
}: Props<T>) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      <ScaleFade initialScale={initialScale} in={!loading}>
        {children}
      </ScaleFade>
    </Box>
  );
}
