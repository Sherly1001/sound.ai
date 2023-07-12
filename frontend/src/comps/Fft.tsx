import { Box } from '@chakra-ui/react';
import {
  CategoryScale,
  Chart,
  LineElement,
  LinearScale,
  PointElement,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { recordService } from '../services';
import { fftToArr } from '../utils/funcs';

Chart.register(LineElement, PointElement, CategoryScale, LinearScale);

export interface Props {
  recordId?: string;
}

export default function Fft({ recordId }: Props) {
  const [arr, setArr] = useState<number[]>([]);

  useEffect(() => {
    recordId &&
      recordService
        .getFft(recordId)
        .then((res) => {
          setArr(fftToArr(res.data ?? ''));
        })
        .catch(console.debug);
  }, [recordId]);

  return (
    <Box>
      <Line
        options={{
          animation: false,
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
            decimation: {
              enabled: true,
              algorithm: 'lttb',
              samples: 1000,
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
