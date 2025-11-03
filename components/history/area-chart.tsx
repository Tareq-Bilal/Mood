"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PRIMARY_COLOR } from "@/utils/constants";

export const description = "Sentiment score tracking over time";

const chartConfig = {
  score: {
    label: "Sentiment Score",
    color: PRIMARY_COLOR,
  },
} satisfies ChartConfig;

interface SentimentDataProps {
  SentimentData: {
    chartData: Array<{
      date: string;
      score: number;
      mood: string;
      color: string;
    }>;
    average: number | null;
    stats: {
      total: number;
      average: number | null;
      highest: number | null;
      lowest: number | null;
      mostCommonMood: string | null;
    };
    dateRange: {
      start: string;
      end: string;
    };
  };
}

// Custom dot component that uses the color from each data point
const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;

  if (!payload) return null;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill={payload.color}
      stroke="#fff"
      strokeWidth={2}
      className="cursor-pointer hover:r-6 transition-all"
    />
  );
};

// Custom active dot (when hovering)
const CustomActiveDot = (props: any) => {
  const { cx, cy, payload } = props;

  if (!payload) return null;

  return (
    <g>
      {/* Outer glow circle */}
      <circle cx={cx} cy={cy} r={10} fill={payload.color} opacity={0.2} />
      {/* Main dot */}
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={payload.color}
        stroke="#fff"
        strokeWidth={3}
      />
    </g>
  );
};

export function ChartAreaDefault({ SentimentData }: SentimentDataProps) {
  const { chartData, average, stats, dateRange } = SentimentData;

  // Calculate trend
  const getTrend = () => {
    if (!chartData || chartData.length < 2) return null;
    const firstScore = chartData[0].score;
    const lastScore = chartData[chartData.length - 1].score;
    const diff = lastScore - firstScore;
    return {
      direction: diff > 0 ? "up" : diff < 0 ? "down" : "stable",
      percentage: Math.abs((diff / firstScore) * 100).toFixed(1),
    };
  };

  const trend = getTrend();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">
          Sentiment Score History (Last 30 Days)
        </CardTitle>
        <CardDescription>
          Average Score:{" "}
          <span className="font-bold text-indigo-500">{average ?? "N/A"}</span>{" "}
          / 10
          {stats.mostCommonMood && (
            <span className="ml-4">
              Most Common Mood:{" "}
              <span className="font-bold">{stats.mostCommonMood}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData && chartData.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
            >
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={PRIMARY_COLOR}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={PRIMARY_COLOR}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "#888" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "#888" }}
                domain={[-10, 10]}
              />
              <ChartTooltip
                cursor={{ stroke: PRIMARY_COLOR, strokeWidth: 2 }}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    labelFormatter={(value, payload) => {
                      const data = payload?.[0]?.payload;
                      return (
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold">{value}</span>
                          {data?.mood && (
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: data.color }}
                              />
                              <span className="text-sm text-muted-foreground">
                                Mood: {data.mood}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    }}
                  />
                }
              />
              <Area
                dataKey="score"
                type="monotone"
                fill="url(#colorScore)"
                fillOpacity={1}
                stroke={PRIMARY_COLOR}
                strokeWidth={2}
                dot={<CustomDot />}
                activeDot={<CustomActiveDot />}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No sentiment data available yet. Start journaling to see your mood
            trends!
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-4 text-sm">
          <div className="grid gap-2 flex-1">
            <div className="flex items-center gap-2 font-medium leading-none">
              {trend?.direction === "up" && (
                <>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-green-500">
                    Trending up by {trend.percentage}%
                  </span>
                </>
              )}
              {trend?.direction === "down" && (
                <>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-red-500">
                    Trending down by {trend.percentage}%
                  </span>
                </>
              )}
              {trend?.direction === "stable" && (
                <>
                  <Minus className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-500">Stable mood</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Period: {dateRange.start} - {dateRange.end}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
