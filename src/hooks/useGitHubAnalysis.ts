import { useState } from "react";
import { analyzeProfile, type ProfileAnalysis } from "@/lib/github";

export function useGitHubAnalysis() {
  const [data, setData] = useState<ProfileAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (username: string) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await analyzeProfile(username.trim());
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, analyze };
}
