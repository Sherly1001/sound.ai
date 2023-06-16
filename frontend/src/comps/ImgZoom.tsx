import { Box, Image } from '@chakra-ui/react';
import { useRef, useState } from 'react';

interface Props {
  src: string;
  width?: string;
  height?: string;
  zoomScale?: number;
  transitionTime?: number;
}

export default function ImgZoom({
  src,
  width,
  height,
  zoomScale = 3,
  transitionTime = 0.1,
}: Props) {
  const boxRef = useRef<HTMLDivElement>(null);

  const [zoom, setZoom] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  return (
    <Box
      ref={boxRef}
      overflow="hidden"
      onMouseOver={() => setZoom(true)}
      onMouseOut={() => setZoom(false)}
      onMouseMove={(e) => {
        if (boxRef.current) {
          const {
            left: offsetLeft,
            top: offsetTop,
            width,
            height,
          } = boxRef.current?.getBoundingClientRect();

          let x = ((e.pageX - offsetLeft) / width) * 100;
          let y = ((e.pageY - offsetTop) / height) * 100;

          setMouseX(x);
          setMouseY(y);
        }
      }}
      cursor="pointer"
    >
      <Box
        backgroundImage={`url("${src}")`}
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
        backgroundSize="auto 100%"
        transition={`transform ${transitionTime}s ease-out`}
        transform={zoom ? `scale(${zoomScale})` : 'scale(1.0)'}
        transformOrigin={`${mouseX}% ${mouseY}%`}
      >
        <Image
          src={src}
          minWidth={width}
          minHeight={height}
          visibility="hidden"
        />
      </Box>
    </Box>
  );
}
