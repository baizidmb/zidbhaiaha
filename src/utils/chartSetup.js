import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Global Chart Defaults for Slate Dark Theme
ChartJS.defaults.color = '#94a3b8';
ChartJS.defaults.font.family = 'Plus Jakarta Sans, sans-serif';
ChartJS.defaults.borderColor = '#334155';

export default ChartJS;
