import HeroSearch from "@/components/HeroSearch";
import ProfileOverview from "@/components/ProfileOverview";
import LanguageBreakdown from "@/components/LanguageBreakdown";
import ActivityChart from "@/components/ActivityChart";
import RepoList from "@/components/RepoList";
import { useGitHubAnalysis } from "@/hooks/useGitHubAnalysis";
import { Github } from "lucide-react";

const Index = () => {
  const { data, loading, error, analyze } = useGitHubAnalysis();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center gap-2">
          <Github className="w-5 h-5 text-primary" />
          <span className="font-bold text-foreground">GitAnalyzer</span>
          <span className="text-xs text-muted-foreground font-mono ml-1">v1.0</span>
        </div>
      </header>

      <HeroSearch onSearch={analyze} loading={loading} />

      {error && (
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-center text-destructive">
            {error}
          </div>
        </div>
      )}

      {loading && (
        <div className="container mx-auto px-4 max-w-4xl py-12 text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Analyzing profile... This may take a moment.</p>
        </div>
      )}

      {data && (
        <div className="container mx-auto px-4 max-w-5xl py-8 space-y-6">
          <ProfileOverview data={data} />
          <div className="grid gap-6 md:grid-cols-2">
            <LanguageBreakdown languages={data.topLanguages} />
            <ActivityChart timeline={data.activityTimeline} />
          </div>
          <RepoList repos={data.repos} />
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Built with React & GitHub API · Uses public data only · Rate limited to 60 req/hr
        </div>
      </footer>
    </div>
  );
};

export default Index;
