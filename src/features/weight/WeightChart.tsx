import { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  ChartOptions,
} from "chart.js";
import { TrendingUp, TrendingDown, Minus, Scale } from "lucide-react";
import { Card, Chip } from "../../components/ui";
import {
  useWeightData,
  calculateWeightStats,
  formatDateLabel,
  type TimeFrame,
} from "./WeightStats";
import { useChartColors } from "./useChartColors";
import type { EntriesMap } from "../../types";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
);

const TIMEFRAMES: { id: TimeFrame; label: string }[] = [
  { id: "30d", label: "30 Days" },
  { id: "90d", label: "90 Days" },
  { id: "6m", label: "6 Months" },
];

interface WeightChartProps {
  entries: EntriesMap;
}

/**
 * Weight Chart component with timeframe toggles
 */
const WeightChart = ({ entries }: WeightChartProps) => {
  const [timeframe, setTimeframe] = useState<TimeFrame>("30d");
  const { primary: chartColor, background: chartBgColor } = useChartColors();

  const weightData = useWeightData(entries, timeframe);
  const stats = useMemo(() => calculateWeightStats(weightData), [weightData]);

  const chartData = useMemo(
    () => ({
      labels: weightData.map((d) => formatDateLabel(d.date, timeframe)),
      datasets: [
        {
          data: weightData.map((d) => d.weight),
          borderColor: chartColor,
          backgroundColor: chartBgColor,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: timeframe === "30d" ? 4 : 2,
          pointBackgroundColor: chartColor,
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointHoverRadius: 6,
        },
      ],
    }),
    [weightData, timeframe, chartColor, chartBgColor],
  );

  const chartOptions = useMemo<ChartOptions<"line">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(30, 30, 30, 0.9)",
          titleColor: "#fff",
          bodyColor: "#ccc",
          borderColor: "rgba(255, 255, 255, 0.1)",
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          displayColors: false,
          callbacks: {
            title: (items) => items[0]?.label || "",
            label: (context) => `${(context.parsed.y || 0).toFixed(1)} lbs`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "#888",
            font: { size: 12 },
            maxTicksLimit: 6,
          },
        },
        y: {
          grid: { color: "rgba(100, 100, 100, 0.1)" },
          ticks: {
            color: "#888",
            font: { size: 12 },
            callback: (value) => `${value}`,
          },
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
    }),
    [],
  );

  const getTrendIcon = () => {
    switch (stats.trend) {
      case "up":
        return <TrendingUp size={18} className="text-error" />;
      case "down":
        return <TrendingDown size={18} className="text-success" />;
      default:
        return <Minus size={18} className="text-base-content/40" />;
    }
  };

  return (
    <Card className="mt-4">
      {/* Header - Responsive layout for zoomed/accessibility modes */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Scale size={20} className="text-secondary" />
          <h3 className="font-semibold text-base-content">Weight Tracker</h3>
        </div>

        {/* Timeframe Toggles - Accessible touch targets */}
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Time period filter"
        >
          {TIMEFRAMES.map(({ id, label }) => (
            <Chip
              key={id}
              active={timeframe === id}
              onClick={() => setTimeframe(id)}
              size="md"
              aria-pressed={timeframe === id}
            >
              {label}
            </Chip>
          ))}
        </div>
      </div>

      {/* Chart or Empty State */}
      {weightData.length > 0 ? (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="text-center p-2 rounded-lg bg-base-200 border border-base-content/5">
              <div className="text-xs text-base-content/60">Current</div>
              <div className="text-sm font-bold text-base-content">
                {stats.current}
              </div>
            </div>
            <div className="text-center p-2 rounded-lg bg-base-200 border border-base-content/5">
              <div className="text-xs text-base-content/60">Low</div>
              <div className="text-sm font-bold text-success">{stats.min}</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-base-200 border border-base-content/5">
              <div className="text-xs text-base-content/60">High</div>
              <div className="text-sm font-bold text-error">{stats.max}</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-base-200 border border-base-content/5">
              <div className="text-xs text-base-content/60">Trend</div>
              <div className="flex items-center justify-center pt-0.5">
                {getTrendIcon()}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-48">
            <Line data={chartData} options={chartOptions} />
          </div>
        </>
      ) : (
        <div className="h-48 flex flex-col items-center justify-center text-center">
          <Scale size={40} className="text-base-content/30 mb-3" />
          <p className="text-base-content/70 text-sm">
            No weight data for this period
          </p>
          <p className="text-base-content/50 text-xs mt-1">
            Tap on a day to log your weight
          </p>
        </div>
      )}
    </Card>
  );
};

export default WeightChart;
