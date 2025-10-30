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
    <Card className="w-full">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl lg:text-3xl">
          Sentiment Score History (Last 30 Days)
        </CardTitle>
        <CardDescription className="text-sm sm:text-base flex flex-col sm:flex-row gap-2 sm:gap-0">
          <span>
            Average Score:{" "}
            <span className="font-bold text-indigo-500">
              {average ?? "N/A"}
            </span>{" "}
            / 10
          </span>
          {stats.mostCommonMood && (
            <span className="sm:ml-4">
              Most Common Mood:{" "}
              <span className="font-bold">{stats.mostCommonMood}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6 pt-4 sm:pt-6">
        {chartData && chartData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="h-[250px] sm:h-[350px] md:h-[400px] w-full"
          >
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 0,
                right: 8,
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
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="opacity-50"
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "#888", fontSize: 10 }}
                className="text-[10px] sm:text-xs"
                interval="preserveStartEnd"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "#888", fontSize: 10 }}
                className="text-[10px] sm:text-xs"
                domain={[-10, 10]}
                width={35}
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
                          <span className="font-semibold text-xs sm:text-sm">
                            {value}
                          </span>
                          {data?.mood && (
                            <span className="text-xs text-muted-foreground">
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
          <div className="flex h-[250px] sm:h-[350px] md:h-[400px] items-center justify-center text-muted-foreground text-sm sm:text-base text-center px-4">
            No sentiment data available yet. Start journaling to see your mood
            trends!
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-4 sm:flex-row px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="flex w-full flex-col sm:flex-row items-start sm:items-center gap-4 text-xs sm:text-sm">
          <div className="grid gap-2 flex-1 w-full sm:w-auto">
            <div className="flex items-center gap-2 font-medium leading-none text-sm sm:text-base">
              {trend?.direction === "up" && (
                <>
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                  <span className="text-green-500">
                    Trending up by {trend.percentage}%
                  </span>
                </>
              )}
              {trend?.direction === "down" && (
                <>
                  <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                  <span className="text-red-500">
                    Trending down by {trend.percentage}%
                  </span>
                </>
              )}
              {trend?.direction === "stable" && (
                <>
                  <Minus className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                  <span className="text-gray-500">Stable mood</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground text-xs sm:text-sm">
              Period: {dateRange.start} - {dateRange.end}
            </div>
          </div>
          <div className="grid gap-1 w-full sm:w-auto sm:text-right">
            <div className="text-[10px] sm:text-xs text-muted-foreground">
              Statistics
            </div>
            <div className="text-xs sm:text-sm whitespace-nowrap">
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
