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

export const description = "Sentiment score tracking over time";

const chartConfig = {
  score: {
    label: "Sentiment Score",
    color: "#6366f1", // Indigo-500
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
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
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
                cursor={{ stroke: "#6366f1", strokeWidth: 2 }}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    labelFormatter={(value, payload) => {
                      const data = payload?.[0]?.payload;
                      return (
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold">{value}</span>
                          {data?.mood && (
                            <span className="text-sm text-muted-foreground">
                              Mood: {data.mood}
                            </span>
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
                stroke="#6366f1"
                strokeWidth={2}
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
          <div className="grid gap-1 text-right">
            <div className="text-xs text-muted-foreground">Statistics</div>
            <div className="text-sm">
              High:{" "}
              <span className="font-bold text-green-500">
                {stats.highest ?? "N/A"}
              </span>{" "}
              | Low:{" "}
              <span className="font-bold text-red-500">
                {stats.lowest ?? "N/A"}
              </span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
