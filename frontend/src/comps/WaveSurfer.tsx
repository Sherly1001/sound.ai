import { Box, Flex, Text } from '@chakra-ui/react';
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RefObject, useEffect, useRef, useState } from 'react';
import WaveSurfer, { WaveSurferOptions } from 'wavesurfer.js';

export function useWaveSurfer(
  containerRef: RefObject<HTMLDivElement>,
  options: Omit<WaveSurferOptions, 'container'>,
) {
  const [ws, setWs] = useState<WaveSurfer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const wavesurfer = WaveSurfer.create({
      ...options,
      container: containerRef.current,
    });

    setWs(wavesurfer);

    return () => {
      wavesurfer.destroy();
    };
  }, [containerRef, options]);

  return ws;
}

export interface Props {
  options: Omit<WaveSurferOptions, 'container'>;
}

export default function ReactWaveSurfer({ options }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  const wavesurfer = useWaveSurfer(ref, options);

  useEffect(() => {
    if (!wavesurfer) return;

    const subs: Function[] = [];

    subs.push(
      wavesurfer.on('pause', () => {
        setPlaying(false);
      }),
    );
    subs.push(
      wavesurfer.on('finish', () => {
        wavesurfer.seekTo(0);
      }),
    );

    return () => {
      subs.forEach((unsub) => unsub());
    };
  }, [wavesurfer]);

  useEffect(() => {
    if (!wavesurfer || typeof playing == 'undefined') return;
    playing ? wavesurfer.play() : wavesurfer.pause();
  }, [playing, wavesurfer]);

  return (
    <Box>
      <Flex userSelect="none" alignItems="center">
        <Text marginEnd="2">Sound track: </Text>
        <FontAwesomeIcon
          icon={playing ? faStop : faPlay}
          onClick={() => setPlaying(!playing)}
          cursor="pointer"
        />
      </Flex>
      <Box
        ref={ref}
        onWheel={(e) => {
          ref.current
            ?.querySelector('div')
            ?.shadowRoot?.querySelector('div')
            ?.scrollBy({ left: e.deltaY, behavior: 'smooth' });
        }}
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      />
    </Box>
  );
}
