import { Star, GitFork, Clock, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RepoAnalysis } from "@/lib/github";
import ScoreRing from "./ScoreRing";

interface RepoCardProps {
  analysis: RepoAnalysis;
}

const RepoCard = ({ analysis }: RepoCardProps) => {
  const { repo, commitCount, score, scoreBreakdown, languages } = analysis;
  const topLangs = Object.keys(languages).slice(0, 3);
  const lastUpdate = new Date(repo.pushed_at).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <Card className="hover:border-primary/30 transition-all duration-300 group">
      <CardContent className="p-5">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold font-mono text-sm hover:underline truncate"
              >
                {repo.name}
              </a>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
            {repo.description && (
              <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{repo.description}</p>
            )}

            <div className="flex flex-wrap gap-1.5 mb-3">
              {topLangs.map((lang) => (
                <Badge key={lang} variant="secondary" className="text-xs font-mono">
                  {lang}
                </Badge>
              ))}
              {repo.topics?.slice(0, 2).map((topic) => (
                <Badge key={topic} variant="outline" className="text-xs">
                  {topic}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5" /> {repo.stargazers_count}</span>
              <span className="flex items-center gap-1"><GitFork className="w-3.5 h-3.5" /> {repo.forks_count}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {lastUpdate}</span>
              <span>{commitCount} commits</span>
            </div>
          </div>

          <ScoreRing score={score} size={64} label="" />
        </div>

        {/* Score breakdown bar */}
        <div className="mt-4 grid grid-cols-4 gap-1">
          {(["activity", "popularity", "codeQuality", "documentation"] as const).map((key) => (
            <div key={key} className="text-center">
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-primary/70 rounded-full transition-all duration-500"
                  style={{ width: `${(scoreBreakdown[key] / 25) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 block capitalize">
                {key === "codeQuality" ? "Quality" : key === "documentation" ? "Docs" : key}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RepoCard;
