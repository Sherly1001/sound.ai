import { Box } from '@chakra-ui/react';
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HTMLAttributes, useRef, useState } from 'react';

export interface Props extends HTMLAttributes<HTMLAudioElement> {
  src: string;
}

export default function PlayAudio({ src, ...props }: Props) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  return (
    <Box userSelect="none">
      <FontAwesomeIcon
        icon={playing ? faStop : faPlay}
        onClick={() => {
          if (audioRef.current) {
            if (audioRef.current.paused) {
              audioRef.current.play();
              setPlaying(true);
            } else {
              audioRef.current.pause();
              setPlaying(false);
            }
          }
        }}
        cursor="pointer"
      />
      <Box display="none">
        <audio {...props} ref={audioRef} onEnded={() => setPlaying(false)}>
          <source src={src} />
        </audio>
      </Box>
    </Box>
  );
}
