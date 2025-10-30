"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const Question = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) return;

    setIsLoading(true);
    setAnswer("");

    try {
      const response = await fetch("/api/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();

      if (response.ok) {
        setAnswer(data.answer);
      } else {
        setAnswer(data.error || "Failed to get answer. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setAnswer("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
        <Input
          type="text"
          placeholder="Ask about your journals..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={isLoading}
          className="flex-1 text-sm sm:text-base md:text-lg p-4"
        />
        <Button
          type="submit"
          disabled={isLoading || !question.trim()}
          className="cursor-pointer whitespace-nowrap text-sm sm:text-base p-4 bg-indigo-500 hover:bg-indigo-600 text-white border-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Thinking...
            </>
          ) : (
            "Ask"
          )}
        </Button>
      </form>

      {answer && (
        <div className="w-full p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-sm sm:text-base leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default Question;
