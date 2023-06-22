import { Box } from '@chakra-ui/react';
import {
  CategoryScale,
  Chart,
  LineElement,
  LinearScale,
  PointElement,
} from 'chart.js';
import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { fftToArr } from '../utils/funcs';

Chart.register(LineElement, PointElement, CategoryScale, LinearScale);

export interface Props {
  fft?: string;
}

export default function Fft({ fft }: Props) {
  const arr = useMemo(() => (fft ? fftToArr(fft) : undefined), [fft]);

  return (
    <Box>
      <Line
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        }}
        data={{
          labels: [...Array(arr?.length).keys()],
          datasets: [
            {
              data: arr,
              pointStyle: false,
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
          ],
        }}
      />
    </Box>
  );
}
