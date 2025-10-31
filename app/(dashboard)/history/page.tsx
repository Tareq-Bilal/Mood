import React from "react";
import { ChartAreaDefault } from "@/components/history/area-chart";
import {
  getAllSentimentScores,
  getAvgSentimentScores,
  getSentimentStats,
} from "@/utils/sentiment";
import { getUserByClerkId } from "@/utils/auth";

const HistoryPage = async () => {
  const user = await getUserByClerkId();

  // Fetch sentiment data
  const allScores = await getAllSentimentScores(user?.id || "", 30); // Last 30 days for current user
  const avgScore = await getAvgSentimentScores(user?.id || "", 30);
  const stats = await getSentimentStats(user?.id || "");

  // Format data for the chart
  const chartData = allScores.map((score) => ({
    date: new Date(score.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    score: score.score,
    mood: score.mood,
    color: score.color,
  }));

  const SentimentData = {
    chartData,
    average: avgScore,
    stats,
    dateRange: {
      start: allScores[0]?.createdAt
        ? new Date(allScores[0].createdAt).toLocaleDateString()
        : "N/A",
      end: allScores[allScores.length - 1]?.createdAt
        ? new Date(
            allScores[allScores.length - 1].createdAt
          ).toLocaleDateString()
        : "N/A",
    },
  };

  return (
    <div className="container mx-auto py-8">
      <ChartAreaDefault SentimentData={SentimentData} />
    </div>
  );
};

export default HistoryPage;
