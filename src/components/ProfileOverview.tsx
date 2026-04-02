import { GitFork, Star, Users, Calendar, MapPin, Building, Globe, Code } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { ProfileAnalysis } from "@/lib/github";
import ScoreRing from "./ScoreRing";

interface ProfileOverviewProps {
  data: ProfileAnalysis;
}

const ProfileOverview = ({ data }: ProfileOverviewProps) => {
  const { user, overallScore, totalCommits, totalStars, totalForks, accountAge } = data;

  const stats = [
    { label: "Repositories", value: user.public_repos, icon: Code },
    { label: "Total Stars", value: totalStars, icon: Star },
    { label: "Total Forks", value: totalForks, icon: GitFork },
    { label: "Commits", value: totalCommits, icon: Calendar },
    { label: "Followers", value: user.followers, icon: Users },
    { label: "Account Age", value: `${accountAge}y`, icon: Calendar },
  ];

  return (
    <Card className="gradient-border overflow-hidden">
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          {/* Avatar and info */}
          <div className="flex flex-col items-center gap-3">
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-24 h-24 rounded-2xl border-2 border-primary/20"
            />
            <ScoreRing score={overallScore} size={80} />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-foreground">{user.name || user.login}</h2>
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-mono text-sm"
            >
              @{user.login}
            </a>
            {user.bio && <p className="text-muted-foreground mt-2 max-w-md">{user.bio}</p>}
            <div className="flex flex-wrap gap-3 mt-3 justify-center sm:justify-start">
              {user.location && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" /> {user.location}
                </span>
              )}
              {user.company && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Building className="w-3.5 h-3.5" /> {user.company}
                </span>
              )}
              {user.blog && (
                <a href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-accent hover:underline">
                  <Globe className="w-3.5 h-3.5" /> Website
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-secondary/50 rounded-xl p-3 text-center">
              <stat.icon className="w-4 h-4 text-primary mx-auto mb-1" />
              <div className="text-lg font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileOverview;
