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
} from "chart.js";
import { TrendingUp, TrendingDown, Minus, Scale } from "lucide-react";
import { Card, Chip } from "../../components/ui";
import {
  useWeightData,
  calculateWeightStats,
  formatDateLabel,
} from "./WeightStats";

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

const TIMEFRAMES = [
  { id: "30d", label: "30 Days" },
  { id: "6m", label: "6 Months" },
  { id: "1y", label: "1 Year" },
];

/**
 * Weight Chart component with timeframe toggles
 */
const WeightChart = ({ entries }) => {
  const [timeframe, setTimeframe] = useState("30d");

  const weightData = useWeightData(entries, timeframe);
  const stats = useMemo(() => calculateWeightStats(weightData), [weightData]);

  const chartData = useMemo(
    () => ({
      labels: weightData.map((d) => formatDateLabel(d.date, timeframe)),
      datasets: [
        {
          data: weightData.map((d) => d.weight),
          borderColor: "rgb(236, 72, 153)",
          backgroundColor: "rgba(236, 72, 153, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: timeframe === "30d" ? 4 : 2,
          pointBackgroundColor: "rgb(236, 72, 153)",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointHoverRadius: 6,
        },
      ],
    }),
    [weightData, timeframe],
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(30, 30, 60, 0.95)",
          titleColor: "#fff",
          bodyColor: "#a5a5c8",
          borderColor: "rgba(139, 92, 246, 0.3)",
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          displayColors: false,
          callbacks: {
            title: (items) => items[0]?.label || "",
            label: (context) => `${context.parsed.y.toFixed(1)} lbs`,
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: "#6b6b8a",
            font: {
              size: 10,
            },
            maxTicksLimit: 6,
          },
        },
        y: {
          grid: {
            color: "rgba(139, 92, 246, 0.1)",
          },
          ticks: {
            color: "#6b6b8a",
            font: {
              size: 10,
            },
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
        return <TrendingUp size={16} className="text-(color-accent)" />;
      case "down":
        return <TrendingDown size={16} className="text-(color-success)" />;
      default:
        return <Minus size={16} className="text-(text-muted)" />;
    }
  };

  return (
    <Card className="mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Scale size={20} className="text-(color-secondary)" />
          <h3 className="font-semibold text-(text-primary)">Weight Tracker</h3>
        </div>

        {/* Timeframe Toggles */}
        <div className="flex gap-1">
          {TIMEFRAMES.map(({ id, label }) => (
            <Chip
              key={id}
              active={timeframe === id}
              onClick={() => setTimeframe(id)}
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
            <div className="text-center p-2 rounded-lg bg-(bg-tertiary)">
              <div className="text-xs text-(text-muted)">Current</div>
              <div className="text-sm font-semibold text-(text-primary)">
                {stats.current}
              </div>
            </div>
            <div className="text-center p-2 rounded-lg bg-(bg-tertiary)">
              <div className="text-xs text-(text-muted)">Min</div>
              <div className="text-sm font-semibold text-(color-success)">
                {stats.min}
              </div>
            </div>
            <div className="text-center p-2 rounded-lg bg-(bg-tertiary)">
              <div className="text-xs text-(text-muted)">Max</div>
              <div className="text-sm font-semibold text-(color-danger)">
                {stats.max}
              </div>
            </div>
            <div className="text-center p-2 rounded-lg bg-(bg-tertiary)">
              <div className="text-xs text-(text-muted)">Trend</div>
              <div className="flex items-center justify-center">
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
          <Scale size={40} className="text-(text-muted) mb-3" />
          <p className="text-(text-secondary) text-sm">
            No weight data for this period
          </p>
          <p className="text-(text-muted) text-xs mt-1">
            Tap on a day to log your weight
          </p>
        </div>
      )}
    </Card>
  );
};

export default WeightChart;
